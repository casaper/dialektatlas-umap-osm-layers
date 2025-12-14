/**
 * Checks if value is symbol.
 *
 * @param subject - the subject
 */
export const isSymbol = <TSubject = symbol>(
  subject: TSubject | unknown
): subject is TSubject => typeof subject === 'symbol';
