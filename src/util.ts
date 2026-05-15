import { program } from '@commander-js/extra-typings';

import {
  pdfExtractCommand,
  scanPdfPagesCommand,
  transformCsvsCommand,
  wordCsvMapCommand,
} from './commands';

program
  .name('util')
  .version('0.0.1')
  .description(
    'Utility commands to convert Dialektatlas CSV and geo data to umap layers'
  )
  .addCommand(transformCsvsCommand)
  .addCommand(wordCsvMapCommand)
  .addCommand(pdfExtractCommand)
  .addCommand(scanPdfPagesCommand)
  .parse();
