import { createCommand } from '@commander-js/extra-typings';
import { glob } from 'glob';
import { basename, join } from 'path';
import * as zod from 'zod';

import { prisma } from '../lib';
import { wordMappingCsvsDir } from '../paths';

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
  .description('Index QGIS CSV files and upsert Word rows with CSV references')
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

    console.log(
      `Found ${Object.keys(csvWordGroups).length} words. Upserting...`
    );

    for (const [wordKey, { word, jung, alt, sds, older }] of Object.entries(
      csvWordGroups
    )) {
      await prisma.word.upsert({
        where: { wordKey },
        create: {
          wordKey,
          word,
          csvJung: jung ?? null,
          csvAlt: alt ?? null,
          csvSds: sds ?? null,
          csvOlder: older ?? null,
        },
        update: {
          word,
          csvJung: jung ?? null,
          csvAlt: alt ?? null,
          csvSds: sds ?? null,
          csvOlder: older ?? null,
        },
      });
    }

    await prisma.$disconnect();
    console.log(
      `Done — ${Object.keys(csvWordGroups).length} Word rows upserted.`
    );
  });
