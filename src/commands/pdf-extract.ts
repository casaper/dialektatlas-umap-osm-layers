import { createCommand } from '@commander-js/extra-typings';
import { execFile as cpExecFile } from 'child_process';
import clc from 'cli-color';
import { mkdir, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { basename, join } from 'path';
import { promisify } from 'util';

import {
  dialektatlasPdfPath,
  wordDataDir,
  wordPdfPageIndexPath,
  wordPdfPagesDir,
  wordPdfTocPath,
} from '../paths';
import {
  knownUnmatchable,
  matchTocLabel,
  pdfPageOverrides,
} from './pdf-word-map';

const execFile = promisify(cpExecFile);

type TocEntry = { label: string; startPage: number };

export type PageIndexEntry = {
  label: string;
  startPage: number;
  sdsPage: number;
  altJungPage: number;
};

export type WordPdfPageIndex = Record<string, PageIndexEntry>;

type QpdfOutlineEntry = {
  title: string;
  destpageposfrom1: number;
  kids: QpdfOutlineEntry[];
};

const collectLeafEntries = (entries: QpdfOutlineEntry[]): TocEntry[] =>
  entries.flatMap(entry => {
    if (entry.kids.length > 0) return collectLeafEntries(entry.kids);
    if (entry.destpageposfrom1 < 27) return [];
    // Normalise whitespace: collapse thin spaces / multiple spaces, strip edges
    const label = entry.title.replace(/\s+/g, ' ').trim();
    return [{ label, startPage: entry.destpageposfrom1 }];
  });

const parseNativeOutline = async (): Promise<TocEntry[]> => {
  const { stdout } = await execFile('qpdf', [
    '--json',
    '--json-key=outlines',
    dialektatlasPdfPath,
  ]);
  const { outlines } = JSON.parse(stdout) as { outlines: QpdfOutlineEntry[] };
  return collectLeafEntries(outlines);
};

const extractPagePdf = (page: number, outPath: string): Promise<unknown> =>
  execFile('qpdf', [
    dialektatlasPdfPath,
    '--pages',
    '.',
    String(page),
    '--',
    outPath,
  ]);

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const pdfExtractCommand = createCommand('pdf-extract')
  .description(
    'Extract PDF pages per word using the native PDF outline (lossless PDF output)'
  )
  .action(async () => {
    console.log('Phase 1: Reading native PDF outline...');
    const toc = await parseNativeOutline();
    await writeFile(wordPdfTocPath, JSON.stringify(toc, null, 2), {
      encoding: 'utf-8',
    });
    console.log(`  Found ${toc.length} entries → ${wordPdfTocPath}`);

    console.log('\nPhase 2: Matching outline entries to word_data keys...');
    const wordDataFiles = await glob(join(wordDataDir, '*.json'));
    const wordKeys = wordDataFiles.map(f => basename(f, '.json'));

    const pageIndex: WordPdfPageIndex = {};
    const unmatched: string[] = [];

    const addToIndex = (wordKey: string, entry: TocEntry) => {
      if (wordKey in pageIndex) return;
      pageIndex[wordKey] = {
        label: entry.label,
        startPage: entry.startPage,
        sdsPage: entry.startPage,
        altJungPage: entry.startPage + 1,
      };
    };

    for (const entry of toc) {
      // Page-based overrides take priority (handles ambiguous duplicate titles)
      if (entry.startPage in pdfPageOverrides) {
        pdfPageOverrides[entry.startPage].forEach(wk => addToIndex(wk, entry));
        continue;
      }
      if (knownUnmatchable.has(entry.label)) continue;
      const matched = matchTocLabel(entry.label, wordKeys);
      if (!matched) {
        unmatched.push(entry.label);
        continue;
      }
      matched.forEach(wk => addToIndex(wk, entry));
    }

    await writeFile(wordPdfPageIndexPath, JSON.stringify(pageIndex, null, 2), {
      encoding: 'utf-8',
    });
    console.log(
      `  Matched ${Object.keys(pageIndex).length} / ${wordKeys.length} word_data entries`
    );
    if (unmatched.length > 0) {
      console.log(
        clc.yellow(`  Unmatched outline entries (${unmatched.length}):`)
      );
      unmatched.forEach(label => console.log(`    - ${label}`));
    }
    console.log(`  Index written → ${wordPdfPageIndexPath}`);

    console.log('\nPhase 3: Extracting pages as lossless PDF...');
    await mkdir(wordPdfPagesDir, { recursive: true });

    const entries = Object.entries(pageIndex);
    const batches = chunkArray(entries, 5);

    let extracted = 0;
    for (const batch of batches) {
      await Promise.all(
        batch.map(async ([wordKey, { sdsPage, altJungPage }]) => {
          const outDir = join(wordPdfPagesDir, wordKey);
          await mkdir(outDir, { recursive: true });
          await Promise.all([
            extractPagePdf(sdsPage, join(outDir, 'sds.pdf')),
            extractPagePdf(altJungPage, join(outDir, 'alt_jung.pdf')),
          ]);
          extracted++;
        })
      );
      process.stdout.write(
        `\r  Extracted ${extracted} / ${entries.length} words...`
      );
    }
    console.log(`\n  PDFs saved → ${wordPdfPagesDir}/`);

    console.log(clc.green('\nDone.'));
  });
