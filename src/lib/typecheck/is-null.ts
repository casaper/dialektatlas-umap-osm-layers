/**
 * Checks if value is null.
 *
 * @param subject - the subject
 */
export const isNull = <TSubject = null>(
  subject: TSubject | unknown
): subject is TSubject => subject === null;
