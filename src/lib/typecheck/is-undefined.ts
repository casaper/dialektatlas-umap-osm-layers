/**
 * Checks if value is undefined.
 *
 * @param subject - the subject
 */
export const isUndefined = <TSubject = undefined>(
  subject: TSubject | unknown
): subject is TSubject => subject === undefined;
