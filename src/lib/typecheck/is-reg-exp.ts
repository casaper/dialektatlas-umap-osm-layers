/**
 * Checks if subject is classified as a `RegExp` object.
 *
 * @param subject - the subject
 */
export const isRegExp = <TSubject = RegExp>(
  subject: TSubject | unknown
): subject is TSubject => subject instanceof RegExp;
