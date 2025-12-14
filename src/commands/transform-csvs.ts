import { createCommand } from '@commander-js/extra-typings';
import clc from 'cli-color';
import { parse } from 'csv-parse/sync';
import { readFile, writeFile } from 'fs/promises';
import { uniqWith } from 'lodash';
import { basename, join } from 'path';

import { dictEntries, exec, notNil } from '../lib';
import { wordAgeGroupedCsvs, wordDataDir, wordMappingCsvsDir } from '../paths';
import { CsvRow, CsvRowSchema } from './csv-rows.zod';
import { WordAgeGroupedCsvsSchema } from './word-csv-map';

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

const processCsvFile = async (filePath: string) => {
  const fileContent = await readFile(filePath, { encoding: 'utf-8' });
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    encoding: 'utf-8',
  });
  await writeFile(
    join(wordMappingCsvsDir, `${basename(filePath, '.csv')}.json`),
    JSON.stringify(records, null, 2)
  );
  const consolidated = records
    .map(row => consolidateRecord(CsvRowSchema.parse(row)))
    .filter(notNil);
  const consolidatedCountOriginal = consolidated.length;

  const haveOneVariant = consolidated.filter(r => r.variants.length === 1);
  const moreThanOneVariants = consolidated.filter(r => r.variants.length > 1);

  const variantHexCodesMap: { [variant in string]: string } = {};

  moreThanOneVariants.forEach(r => {
    const oneHexcodeMatches = haveOneVariant
      .filter(ov => r.hexcodes.includes(ov.hexcode1))
      .map(r => [r.variants[0], r.hexcode1].join('||--||'));
    const uniqOneHexcodeMatchs = [...new Set(oneHexcodeMatches)];
    // console.log(r, uniqOneHexcodeMatchs);
    uniqOneHexcodeMatchs.forEach(vh => {
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

  moreThanOneVariants.forEach(record => {
    if (!record.variants.every(variant => variant in variantHexCodesMap)) {
      return;
    }
    consolidated.splice(consolidated.indexOf(record), 1);
    record.variants.forEach(variant => {
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
        ...(record.different !== undefined && {
          different: record.different,
        }),
      };
      consolidated.push(splitOutVariantRecord);
    });
  });

  const uniquedConsolidated = uniqWith(consolidated, (a, b) => {
    return (
      a.site_code === b.site_code &&
      a.dom_var === b.dom_var &&
      a.hexcode1 === b.hexcode1
    );
  });

  if (uniquedConsolidated.length !== consolidated.length) {
    console.warn(
      [
        clc.yellow(`${basename(filePath)}:`),
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

export const transformCsvsCommand = createCommand('transform-csvs')
  .description('')
  .action(async () => {
    const wordAgeGroupedJson = await readFile(wordAgeGroupedCsvs, {
      encoding: 'utf-8',
    });
    const wordAgeGroupedData = WordAgeGroupedCsvsSchema.parse(
      JSON.parse(wordAgeGroupedJson)
    );
    for (const [
      wordKey,
      { word, jung: jungCsv, sds: sdsCsv, alt: altCsv, older: olderCsv },
    ] of dictEntries(wordAgeGroupedData)) {
      const [sds, older, alt, jung] = await Promise.all(
        [sdsCsv, olderCsv, altCsv, jungCsv].map(async csvFile =>
          csvFile ? processCsvFile(join(wordMappingCsvsDir, csvFile)) : null
        )
      );
      const wordData = {
        word,
        ...(jung && { jung }),
        ...(older && { older }),
        ...(sds && { sds }),
        ...(alt && { alt }),
      };
      const outfilePath = join(wordDataDir, `${wordKey}.json`);
      console.log(
        [
          `Processed word "${word}" (${wordKey}) - '${outfilePath}'`,
          ` - jung: ${jung?.length ?? 0} records`,
          ` - older: ${older?.length ?? 0} records`,
          ` - sds: ${sds?.length ?? 0} records`,
          ` - alt: ${alt?.length ?? 0} records`,
          '------------',
          '',
        ].join('\n')
      );
      await writeFile(outfilePath, JSON.stringify(wordData, null, 2));
      await exec(`pnpx prettier --write "${outfilePath}"`);
    }
  });
