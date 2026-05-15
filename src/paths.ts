import { join, resolve } from 'path';

export const projectRoot = resolve(__dirname, '../');

export const wordMappingCsvsDir = join(
  projectRoot,
  'src/source_data/word_mapping_csvs'
);

export const dialektatlasPdfPath = join(
  projectRoot,
  'src/source_data/Dialaektatlas_2025_150dpi.pdf'
);

export const wordPdfPagesDir = join(
  projectRoot,
  'src/source_data/word_pdf_pages'
);

export const regionGeoJsonPath = join(
  projectRoot,
  'dialektatlas-data-source/export_try/dialekt_regionen_adapted.geojson'
);
