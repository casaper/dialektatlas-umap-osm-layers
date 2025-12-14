/**
 * Checks if value is classified as a Date object.
 *
 * @param subject - the subject
 */
export const isDate = <TSubject = Date>(
  subject: TSubject | unknown
): subject is TSubject => subject instanceof Date && !Number.isNaN(subject);
