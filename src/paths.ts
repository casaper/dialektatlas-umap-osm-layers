import { join, resolve } from 'path';

export const projectRoot = resolve(__dirname, '../');

export const wordMappingCsvsDir = join(
  projectRoot,
  'src/source_data/word_mapping_csvs'
);

export const wordAgeGroupedCsvs = join(
  projectRoot,
  'src/source_data/word-age-grouped-csvs.json'
);
export const wordDataDir = join(projectRoot, 'src/source_data/word_data');
