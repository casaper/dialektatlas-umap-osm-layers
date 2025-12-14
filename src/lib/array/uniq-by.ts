export const uniqBy = <T extends object, Key extends keyof T>(
  arr: T[],
  iteratee: Key
): T[] => {
  return arr.filter(
    (x, i, self) => i === self.findIndex(y => x[iteratee] === y[iteratee])
  );
};
