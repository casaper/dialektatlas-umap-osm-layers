/**
 * TypeScript aware isNumber
 *
 * See the difference in this example here:
 * ```ts
 * // plainFiltered: (string | number)[]
 * const plainFiltered = ['string', 1].filter(s => typeof s === 'number');
 * // isNumberFiltered: number[]
 * const isNumberFiltered = ['string', 1].filter(isNumber);
 * ```
 * [Playground Link](https://www.typescriptlang.org/play?ssl=7&ssc=57&pln=4&pc=1#code/MYewdgzgLgBAlhAcgVwLYCMCmAnGBeGACgmXQCtNgoAuGMNLXAHxmTAGswQB3MASlolylWAjoMc+AHwAoGDCgBPAA6YQAMxhCKVfHgIByehhwGA3DJkB6KzGUAbAIZwwAMTj2oOTABNaxKGwXAHMYFmNGPgBtAF0ZUEhYB2c3Dy9sX3wYKINoILBggwAaGABGGIA6dTScYmkFFTVNCD1DCNM+Cxt4JAlsd09vP3ETbFj48GgelFGB9MyCHLyQ4rLK6sHsQgQZyLMgA)
 */
export const isNumber = <TSubject = number>(
  subject: TSubject | unknown
): subject is TSubject => typeof subject === 'number';
