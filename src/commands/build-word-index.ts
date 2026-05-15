import { createCommand } from '@commander-js/extra-typings';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { basename, join } from 'path';
import { z } from 'zod';

import {
  wordAgeGroupedCsvs,
  wordDataDir,
  wordMasterIndexPath,
  wordPdfPageIndexPath,
  wordPdfScanPath,
} from '../paths';
import type { PageIndexEntry, WordPdfPageIndex } from './pdf-extract';
import type { PdfScanEntry, WordPdfScan } from './scan-pdf-pages';
import { WordAgeGroupedCsvsSchema } from './word-csv-map';

type WordDataSummary = {
  siteCount: Partial<Record<'jung' | 'alt' | 'sds' | 'older', number>>;
  variantCount: Partial<Record<'jung' | 'alt' | 'sds' | 'older', number>>;
  hexcodes: string[];
};

type MasterWordIndexEntry = {
  word: string;
  csvGroups: { jung?: string; alt?: string; older?: string; sds?: string };
  pdf: Pick<PageIndexEntry, 'label' | 'sdsPage' | 'altJungPage'> | null;
  wordData: WordDataSummary | null;
  pdfScan: PdfScanEntry | null;
};

type MasterWordIndex = Record<string, MasterWordIndexEntry>;

const AgeGroupRecordSchema = z.object({
  dom_var: z.string(),
  hexcodes: z.array(z.string()),
});

const WordDataSchema = z.object({
  word: z.string(),
  jung: z.array(AgeGroupRecordSchema).optional(),
  alt: z.array(AgeGroupRecordSchema).optional(),
  sds: z.array(AgeGroupRecordSchema).optional(),
  older: z.array(AgeGroupRecordSchema).optional(),
});

const ageGroups = ['jung', 'alt', 'sds', 'older'] as const;
type AgeGroup = (typeof ageGroups)[number];

type WordDataInfo = { word: string; summary: WordDataSummary };

export const buildWordIndexCommand = createCommand('build-word-index')
  .description(
    'Join word_data, CSV grouping, and PDF page index into a single master index'
  )
  .action(async () => {
    const [csvRaw, pdfRaw, wordDataFiles, pdfScanRaw] = await Promise.all([
      readFile(wordAgeGroupedCsvs, 'utf-8').then(s =>
        WordAgeGroupedCsvsSchema.parse(JSON.parse(s))
      ),
      readFile(wordPdfPageIndexPath, 'utf-8').then(
        s => JSON.parse(s) as WordPdfPageIndex
      ),
      glob(join(wordDataDir, '*.json')),
      readFile(wordPdfScanPath, 'utf-8')
        .then(s => JSON.parse(s) as WordPdfScan)
        .catch(() => ({}) as WordPdfScan),
    ]);

    const wordDataKeySet = new Set(
      wordDataFiles.map(f => basename(f, '.json'))
    );

    const allKeys = new Set([
      ...wordDataKeySet,
      ...Object.keys(csvRaw),
      ...Object.keys(pdfRaw),
    ]);

    const wordDataInfos = new Map<string, WordDataInfo>();
    await Promise.all(
      [...wordDataKeySet].map(async key => {
        const raw = await readFile(join(wordDataDir, `${key}.json`), 'utf-8');
        const parsed = WordDataSchema.parse(JSON.parse(raw));
        const siteCount: Partial<Record<AgeGroup, number>> = {};
        const variantCount: Partial<Record<AgeGroup, number>> = {};
        const allHexcodes = new Set<string>();
        for (const ag of ageGroups) {
          const records = parsed[ag];
          if (!records?.length) continue;
          siteCount[ag] = records.length;
          variantCount[ag] = new Set(records.map(r => r.dom_var)).size;
          records.forEach(r => r.hexcodes.forEach(h => allHexcodes.add(h)));
        }
        wordDataInfos.set(key, {
          word: parsed.word,
          summary: {
            siteCount,
            variantCount,
            hexcodes: [...allHexcodes].sort(),
          },
        });
      })
    );

    const index: MasterWordIndex = {};
    for (const key of [...allKeys].sort()) {
      const csv = csvRaw[key];
      const pdf = pdfRaw[key];
      const info = wordDataInfos.get(key);
      index[key] = {
        word: info?.word ?? key,
        csvGroups: csv
          ? { jung: csv.jung, alt: csv.alt, older: csv.older, sds: csv.sds }
          : {},
        pdf: pdf
          ? {
              label: pdf.label,
              sdsPage: pdf.sdsPage,
              altJungPage: pdf.altJungPage,
            }
          : null,
        wordData: info?.summary ?? null,
        pdfScan: pdfScanRaw[key] ?? null,
      };
    }

    await writeFile(
      wordMasterIndexPath,
      JSON.stringify(index, null, 2),
      'utf-8'
    );

    const withPdf = Object.values(index).filter(e => e.pdf !== null).length;
    const withCsv = Object.values(index).filter(
      e => Object.keys(e.csvGroups).length > 0
    ).length;
    const withWordData = Object.values(index).filter(
      e => e.wordData !== null
    ).length;
    const withPdfScan = Object.values(index).filter(
      e => e.pdfScan !== null
    ).length;
    console.log(`Master index: ${Object.keys(index).length} words`);
    console.log(`  With PDF pages:  ${withPdf}`);
    console.log(`  With CSV data:   ${withCsv}`);
    console.log(`  With word data:  ${withWordData}`);
    console.log(`  With PDF scan:   ${withPdfScan}`);
    console.log(`  Written → ${wordMasterIndexPath}`);
  });
