import { createCommand } from '@commander-js/extra-typings';
import clc from 'cli-color';
import { parse } from 'csv-parse/sync';
import { readFile } from 'fs/promises';
import { uniqWith } from 'lodash';
import { join } from 'path';

import { notNil, prisma } from '../lib';
import { wordMappingCsvsDir } from '../paths';
import { CsvRow, CsvRowSchema } from './csv-rows.zod';

type ConsolidatedRecord = {
  site_code: CsvRow['site_code'];
  dom_var: string;
  variants: string[];
  hexcodes: string[];
  town_name: string;
  hexcode1: string;
  hexcode2?: string;
  hexcode3?: string;
  hexcode4?: string;
  secondary_site_code: string;
  nvar: CsvRow['nvar'];
  different?: boolean;
};

const consolidateRecord = ({
  site_code,
  dom_var,
  nvar,
  sds_sdats,
  hexcode1: h1,
  hexcode2: h2,
  hexcode3: h3,
  hexcode4: h4,
  different,
  ...rest
}: CsvRow): ConsolidatedRecord | undefined => {
  const [, secondary_site_code, town_name] = sds_sdats.split('\n');
  const hexcodesDict = {
    hexcode1: h1 ?? '',
    ...(![h1].includes(h2) && { hexcode2: h2 }),
    ...(![h1, h2].includes(h3) && { hexcode3: h3 }),
    ...(![h1, h2, h3].includes(h4) && { hexcode4: h4 }),
  };
  const { hexcode1, hexcode2, hexcode3, hexcode4 } = hexcodesDict;
  const hexcodes = [hexcode1, hexcode2, hexcode3, hexcode4].filter(notNil);
  const isNumericDomVar = Boolean(dom_var.match(/(\d+|\d+\.\d+)/));

  if (isNumericDomVar && rest.vot) {
    return;
  }

  let variants =
    isNumericDomVar || hexcodes.length <= 1
      ? [dom_var]
      : dom_var.split('/').map(v => v.trim());
  if (hexcodes.length >= 1 && variants.length !== hexcodes.length) {
    variants = [dom_var];
  }
  return {
    site_code,
    dom_var,
    variants,
    ...hexcodesDict,
    hexcodes,
    nvar,
    secondary_site_code,
    town_name,
    ...(different?.length && { different: different === 'TRUE' }),
  };
};

const processCsvFile = async (
  filePath: string
): Promise<ConsolidatedRecord[]> => {
  const fileContent = await readFile(filePath, { encoding: 'utf-8' });
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    encoding: 'utf-8',
  });

  const consolidated = records
    .map((row: unknown) => consolidateRecord(CsvRowSchema.parse(row)))
    .filter(notNil);
  const consolidatedCountOriginal = consolidated.length;

  const haveOneVariant = consolidated.filter(
    (r: ConsolidatedRecord) => r.variants.length === 1
  );
  const moreThanOneVariants = consolidated.filter(
    (r: ConsolidatedRecord) => r.variants.length > 1
  );

  const variantHexCodesMap: Record<string, string> = {};

  moreThanOneVariants.forEach((r: ConsolidatedRecord) => {
    const oneHexcodeMatches = haveOneVariant
      .filter((ov: ConsolidatedRecord) => r.hexcodes.includes(ov.hexcode1))
      .map((r: ConsolidatedRecord) =>
        [r.variants[0], r.hexcode1].join('||--||')
      );
    const uniqOneHexcodeMatchs = [...new Set(oneHexcodeMatches)];
    uniqOneHexcodeMatchs.forEach((vh: string) => {
      const [variant, hexcode] = vh.split('||--||');
      if (!(variant in variantHexCodesMap)) {
        variantHexCodesMap[variant] = hexcode;
      } else if (variantHexCodesMap[variant] !== hexcode) {
        console.warn(
          `Conflict for variant ${variant}: ${variantHexCodesMap[variant]} vs ${hexcode}`
        );
      }
    });
  });

  moreThanOneVariants.forEach((record: ConsolidatedRecord) => {
    if (!record.variants.every(variant => variant in variantHexCodesMap)) {
      return;
    }
    consolidated.splice(consolidated.indexOf(record), 1);
    record.variants.forEach((variant: string) => {
      const hexcode = variantHexCodesMap[variant];
      const splitOutVariantRecord: ConsolidatedRecord = {
        site_code: record.site_code,
        dom_var: variant,
        variants: [variant],
        hexcodes: [hexcode],
        hexcode1: hexcode,
        secondary_site_code: record.secondary_site_code,
        town_name: record.town_name,
        nvar: record.nvar,
        ...(record.different !== undefined && { different: record.different }),
      };
      consolidated.push(splitOutVariantRecord);
    });
  });

  const uniquedConsolidated = uniqWith(
    consolidated,
    (a: ConsolidatedRecord, b: ConsolidatedRecord) =>
      a.site_code === b.site_code &&
      a.dom_var === b.dom_var &&
      a.hexcode1 === b.hexcode1
  );

  if (uniquedConsolidated.length !== consolidated.length) {
    console.warn(
      [
        clc.yellow(`${filePath}:`),
        `original Records count: ${consolidatedCountOriginal}`,
        `Records after: ${consolidated.length} `,
        `Removed ${
          consolidated.length - uniquedConsolidated.length
        } duplicate records after consolidation`,
        '',
      ].join('\n')
    );
    return uniquedConsolidated;
  }
  return consolidated;
};

const ageGroupKeys = ['sds', 'older', 'alt', 'jung'] as const;
type AgeGroupKey = (typeof ageGroupKeys)[number];

export const transformCsvsCommand = createCommand('transform-csvs')
  .description(
    'Process QGIS CSV files and store dialect records in the database'
  )
  .action(async () => {
    const words = await prisma.word.findMany();
    console.log(`Processing ${words.length} words from database...`);

    for (const dbWord of words) {
      const csvMap: Record<AgeGroupKey, string | null> = {
        sds: dbWord.csvSds,
        older: dbWord.csvOlder,
        alt: dbWord.csvAlt,
        jung: dbWord.csvJung,
      };

      const results = await Promise.all(
        ageGroupKeys.map(async ag =>
          csvMap[ag]
            ? processCsvFile(join(wordMappingCsvsDir, csvMap[ag]!))
            : null
        )
      );

      const [sds, older, alt, jung] = results;

      console.log(
        [
          `Processed word "${dbWord.word}" (${dbWord.wordKey})`,
          ` - jung: ${jung?.length ?? 0} records`,
          ` - older: ${older?.length ?? 0} records`,
          ` - sds: ${sds?.length ?? 0} records`,
          ` - alt: ${alt?.length ?? 0} records`,
          '------------',
          '',
        ].join('\n')
      );

      const groupedRecords: [AgeGroupKey, ConsolidatedRecord[]][] = [
        ['jung', jung ?? []],
        ['alt', alt ?? []],
        ['sds', sds ?? []],
        ['older', older ?? []],
      ];

      const sitesToUpsert = new Map<string, string>();
      for (const [, records] of groupedRecords) {
        for (const r of records) {
          if (!sitesToUpsert.has(r.site_code)) {
            sitesToUpsert.set(r.site_code, r.town_name);
          }
        }
      }

      if (sitesToUpsert.size > 0) {
        await prisma.site.createMany({
          data: [...sitesToUpsert.entries()].map(([siteCode, townName]) => ({
            siteCode,
            townName,
          })),
          skipDuplicates: true,
        });
      }

      for (const [ageGroup, records] of groupedRecords) {
        if (records.length === 0) continue;
        await prisma.surveyRecord.createMany({
          data: records.map(r => ({
            wordId: dbWord.id,
            ageGroup,
            siteCode: r.site_code,
            secondarySiteCode: r.secondary_site_code || null,
            domVar: r.dom_var,
            variants: r.variants,
            hexcode1: r.hexcode1,
            hexcodes: r.hexcodes,
            nvar: r.nvar,
            different: r.different ?? null,
          })),
          skipDuplicates: true,
        });
      }
    }

    await prisma.$disconnect();
    console.log('Done.');
  });
