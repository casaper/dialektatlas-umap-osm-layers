/**
 * Typed dictionary keys
 *
 * ```ts
 * // keys: string[]
 * const keys = Object.keys({ a: 1, b: 2 } as const);
 * // typedKeys: ("a" | "b")[]
 * const typedKeys = dictKeys({ a: 1, b: 2 } as const);
 * // keysWritable: string[]
 * const keysWritable = Object.keys({ c: 3, d: 4 });
 * // typedKeysWritable: ("c" | "d")[]
 * const typedKeysWritable = dictKeys({ c: 3, d: 4 });
 * ```
 * [Playground Link](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAJgS2FA0gUwJ4RgXhgHgBUARJWNADyjTDmxACMArNZAGhkPQxkutuwBrTCABmnUsgB8ACkTIAXBLIBKJV0wBtALq4pAKBgwA8s1ZQAdMKxzVMAIbYNGHQG59+0JFjXseUyzIVpgQMgDeDkoAjBwMSgBMMAC+Dthe0Cru6bBQGAAOaHDcfvBkxeGRMDEwcTCJKY4w2Zme4NAwvgDqAE4IUPYMADZouCZmQb4VwEoAzBxwSgAsyS3ZMLkFRSE9fQPDo-KoIVOz80sr7kA)
 */
export const dictKeys = <TDict extends object, TKey extends keyof TDict>(
  dict: TDict
): TKey[] => Object.keys(dict ?? {}) as TKey[];
