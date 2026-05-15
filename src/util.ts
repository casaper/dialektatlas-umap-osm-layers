import { program } from '@commander-js/extra-typings';

import {
  buildWordIndexCommand,
  pdfExtractCommand,
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
  .addCommand(buildWordIndexCommand)
  .parse();
