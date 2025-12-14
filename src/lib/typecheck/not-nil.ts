/**
 * Allows type safe compacting (better than using {@link Boolean})
 *
 * When compacting with `filter(Boolean)`, the result will not loose the type we just filtered out:
 * ```ts
 * const data = [undefined, "as", 1, null];
 * const a = data.filter(Boolean); // => const a: (string | number | null | undefined)[]
 * ```
 *
 * When using this function instead, the filter result gets the correct type:
 * ```ts
 * const data = [undefined, "as", 1, null];
 * const b = data.filter(notNil); // => const b: (string | number)[]
 * ```
 *
 * [See TypeScript Playground](https://bit.ly/3QNXPhK)
 *
 * Given to me by [claudiocro](https://github.com/claudiocro)
 */
export function notNil<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
