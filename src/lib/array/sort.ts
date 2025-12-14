const dirMap = {
  ascending: 1,
  asc: 1,
  ASC: 1,
  descending: -1,
  desc: -1,
  DESC: -1,
} as const;
type Direction = keyof typeof dirMap;

type SortFn<T> = (a: T, b: T) => number;

/**
 *
 */
export const sort =
  <T>(direction: Direction = 'asc'): SortFn<T> =>
  (a: T, b: T): number =>
    a < b ? -1 * dirMap[direction] : a > b ? 1 * dirMap[direction] : 0;

export const sortByProp =
  <T extends object, K extends keyof T>(
    prop: K,
    direction: Direction = 'asc'
  ): SortFn<T> =>
  (a: T, b: T): number =>
    sort(direction)(a[prop], b[prop]);
