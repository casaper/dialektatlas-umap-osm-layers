/**
 * Split array of items into chunks
 *
 * @example
 * ```ts
 * chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3);
 * // => [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
 * chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
 * // => [['a'], ['b'], ['c'], ['d'], ['e'], ['f'], ['g']]
 * ```
 */
export const chunk = <T>(
  items: T[],
  itemsPerChunk = 1,
  accumulator: T[][] = []
): T[][] => {
  if (itemsPerChunk < 1 || items.length < 1) {
    return accumulator;
  }
  return chunk(
    items.slice(itemsPerChunk),
    itemsPerChunk,
    accumulator.concat([items.slice(0, itemsPerChunk)])
  );
};
