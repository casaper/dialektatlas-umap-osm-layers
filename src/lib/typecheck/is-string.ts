/**
 * TypeScript aware isString
 *
 * See the difference in this example here:
 * ```ts
 * // plainFiltered: (string | number)[]
 * const plainFiltered = ['string', 1].filter(s => typeof s === 'string');
 * // isStrFiltered: string[]
 * const isStrFiltered = ['string', 1].filter(isString);
 * ```
 * [Playground Link](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAlhAylATnMBzGBeGAKCAVwCMArAU2CgC4Zo1MYAfGQsAazBAHcwBKWkTKVYCOqnRZsAPgBQMGFACeAB3IgAZnRIUqObLgDk9SYYDcs2aEiwVAGwCG6AGJw7UcinIATHDADaxhKYhgA0MACMALoAdBpuHigEONKKqupaEPpGJiF8FtbQ8Eioru6ePn6BuRhhkbHx5UkIyAwY+UA)
 */
export const isString = <TSubject = string>(
  subject: TSubject | unknown
): subject is TSubject => typeof subject === 'string';
