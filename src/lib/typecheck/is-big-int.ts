/**
 * Checks if value is a BigInt.
 *
 * @param subject - the subject
 */
export const isBigInt = <TSubject = bigint>(
  subject: TSubject | unknown
): subject is TSubject => typeof subject === 'bigint';
