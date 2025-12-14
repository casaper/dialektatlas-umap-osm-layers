import { join, resolve } from 'path';

export const projectRoot = resolve(__dirname, '../');

export const wordMappingCsvsDir = join(
  projectRoot,
  'src/source_data/word_mapping_csvs'
);
