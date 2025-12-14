import { program } from '@commander-js/extra-typings';
import { parse } from 'csv-parse';

program
  .name('util')
  .version('0.0.1')
  .description(
    'Utility commands to convert Dialektatlas CSV and geo data to umap layers'
  );
