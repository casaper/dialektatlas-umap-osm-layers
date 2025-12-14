/**
 * Produce map property of items function
 *
 * ```ts
 * const result = [{ keyName: 1 }, { keyName: 2 }].map(mapProp('keyName'));
 * // => [1, 2]
 * ```
 */
export const mapProp =
  <T, K extends keyof T>(prop: K) =>
  (item: T): T[K] =>
    item[prop];
