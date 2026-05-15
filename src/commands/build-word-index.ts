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
} from '../paths';
import type { PageIndexEntry, WordPdfPageIndex } from './pdf-extract';
import { WordAgeGroupedCsvsSchema } from './word-csv-map';

type MasterWordIndexEntry = {
  word: string;
  csvGroups: { jung?: string; alt?: string; older?: string; sds?: string };
  pdf: Pick<PageIndexEntry, 'label' | 'sdsPage' | 'altJungPage'> | null;
  hasWordData: boolean;
};

type MasterWordIndex = Record<string, MasterWordIndexEntry>;

const WordDataWordSchema = z.object({ word: z.string() });

export const buildWordIndexCommand = createCommand('build-word-index')
  .description(
    'Join word_data, CSV grouping, and PDF page index into a single master index'
  )
  .action(async () => {
    const [csvRaw, pdfRaw, wordDataFiles] = await Promise.all([
      readFile(wordAgeGroupedCsvs, 'utf-8').then(s =>
        WordAgeGroupedCsvsSchema.parse(JSON.parse(s))
      ),
      readFile(wordPdfPageIndexPath, 'utf-8').then(
        s => JSON.parse(s) as WordPdfPageIndex
      ),
      glob(join(wordDataDir, '*.json')),
    ]);

    const wordDataKeySet = new Set(
      wordDataFiles.map(f => basename(f, '.json'))
    );

    const allKeys = new Set([
      ...wordDataKeySet,
      ...Object.keys(csvRaw),
      ...Object.keys(pdfRaw),
    ]);

    const displayNames = new Map<string, string>();
    await Promise.all(
      [...wordDataKeySet].map(async key => {
        const raw = await readFile(join(wordDataDir, `${key}.json`), 'utf-8');
        const { word } = WordDataWordSchema.parse(JSON.parse(raw));
        displayNames.set(key, word);
      })
    );

    const index: MasterWordIndex = {};
    for (const key of [...allKeys].sort()) {
      const csv = csvRaw[key];
      const pdf = pdfRaw[key];
      const hasWordData = wordDataKeySet.has(key);
      index[key] = {
        word: displayNames.get(key) ?? key,
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
        hasWordData,
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
    console.log(`Master index: ${Object.keys(index).length} words`);
    console.log(`  With PDF pages: ${withPdf}`);
    console.log(`  With CSV data:  ${withCsv}`);
    console.log(`  Written → ${wordMasterIndexPath}`);
  });
