import { createCommand } from '@commander-js/extra-typings';
import { parse } from 'csv-parse';

export const transformCsvsCommand = createCommand('transform-csvs')
  .description('')
  .action(async () => {});
