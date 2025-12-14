/**
 * Checks if value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
 *
 * @param subject - the subject to test for being an extend of Error
 */
export const isError = <TSubject = Error>(
  subject: TSubject | unknown
): subject is TSubject => subject instanceof Error;
