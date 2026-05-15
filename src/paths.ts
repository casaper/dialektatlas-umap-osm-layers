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

export const dialektatlasPdfPath = join(
  projectRoot,
  'src/source_data/Dialaektatlas_2025_150dpi.pdf'
);
export const wordPdfTocPath = join(
  projectRoot,
  'src/source_data/word-pdf-toc.json'
);
export const wordPdfPageIndexPath = join(
  projectRoot,
  'src/source_data/word-pdf-page-index.json'
);
export const wordPdfPagesDir = join(
  projectRoot,
  'src/source_data/word_pdf_pages'
);
export const wordPdfScanPath = join(
  projectRoot,
  'src/source_data/word-pdf-scan.json'
);
export const wordMasterIndexPath = join(
  projectRoot,
  'src/source_data/word-master-index.json'
);
