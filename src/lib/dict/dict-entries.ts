/**
 * Typed dictionary entries
 *
 * ```ts
 * // entries: [string, 1 | 2][]
 * const entries = Object.entries({ a: 1, b: 2 } as const);
 * // typedEntries: ["a" | "b", 1 | 2][]
 * const typedEntries = dictEntries({ a: 1, b: 2 } as const);
 * // entriesWritable: [string, number][]
 * const entriesWritable = Object.entries({ c: 3, d: 4 });
 * // typedEntriesWritable: ["c" | "d", number][]
 * const typedEntriesWritable = dictEntries({ c: 3, d: 4 })
 * ```
 * [Playground Link](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAJgS2FAomKAnBBTCMC8MAPAFAwwAqAIkrNgB5TZhx4gBGAVtsgDRmUA0tgCeMBkxZ4A1qJAAzSjT4CKANQCGAG3GNmrJbQDaFYSIC6JAHwAKAYmQAuQ8hIBKZybO9KmreaNzAisYAHkuHigAOmZMHAgbByg3GA08L1EfdW0A8wBuEhJQSDp0LFwCMIjkGLL4mwBvVOcARh92ZwAmGABfVLxi6DcCwdgoEQAHbDg0OIrCJNnyhKaNVvau3v6YUeGi8GhxOtwAdSwoDXYtbErw7hrY5cad5wBmHzhnABZevdGYcZTGbHCBnBAXK43Ba0Jb1JrAN4fb6-PJAA)
 */
export const dictEntries = <
  TDict extends object,
  TKey extends keyof TDict,
  TVal extends TDict[TKey],
>(
  dict: TDict
): [TKey, TVal][] => Object.entries(dict) as [TKey, TVal][];
