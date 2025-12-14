import { createCommand } from '@commander-js/extra-typings';
import { writeFile } from 'fs/promises';
import { glob } from 'glob';
import { basename, join } from 'path';
import * as zod from 'zod';

import { wordAgeGroupedCsvs, wordMappingCsvsDir } from '../paths';

export const ageTypes = ['jung', 'older', 'sds', 'alt'] as const;
export const AgeTypeEnum = zod.enum(ageTypes);
export type AgeType = zod.infer<typeof AgeTypeEnum>;

const isAgeType = (subject: unknown): subject is AgeType =>
  typeof subject === 'string' && ageTypes.includes(subject as AgeType);

export const WordAgeCsvsSchema = zod.object({
  word: zod.string(),
  wordKey: zod.string(),
  jung: zod.string().optional(),
  older: zod.string().optional(),
  sds: zod.string().optional(),
  alt: zod.string().optional(),
});
export type WordAgeCsvs = zod.infer<typeof WordAgeCsvsSchema>;
export const WordAgeGroupedCsvsSchema = zod.record(
  zod.string(),
  WordAgeCsvsSchema
);
export type WordAgeGroupedCsvs = zod.infer<typeof WordAgeGroupedCsvsSchema>;

export const wordCsvMapCommand = createCommand('word-csv-map')
  .description('')
  .action(async () => {
    const csvFiles = await glob(join(wordMappingCsvsDir, '*_QGIS.csv'));
    const csvWordGroups = csvFiles.reduce((acc, file) => {
      const fileName = basename(file, '_QGIS.csv');
      const [, wordKey, , ageGroup] =
        fileName.match(/^(.+)_(1|2|3)_(sds|alt|older|jung)$/) ?? [];
      if (!isAgeType(ageGroup)) {
        return acc;
      }
      const wordData = WordAgeCsvsSchema.parse({
        ...acc[wordKey],
        word: wordKey,
        wordKey,
        [ageGroup]: basename(file),
      });
      acc[wordKey] = wordData;
      return acc;
    }, {} as WordAgeGroupedCsvs);
    console.log(`Found ${Object.keys(csvWordGroups).length} words.`);
    await writeFile(
      wordAgeGroupedCsvs,
      JSON.stringify(csvWordGroups, null, 2),
      { encoding: 'utf-8' }
    );
  });
