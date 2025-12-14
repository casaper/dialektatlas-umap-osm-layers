import { uniq } from './uniq.fn';

/**
 * Concat base with add and remove duplicates
 *
 * Requires base and add to be of the same type
 */
export const mergeArrays = <T>(base: T[], add: T[]): T[] =>
  uniq(base.concat(add));
