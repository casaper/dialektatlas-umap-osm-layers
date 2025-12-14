/**
 * Checks if value is classified as a boolean primitive or object.
 *
 * @param subject - the subject
 */
export const isBoolean = <TSubject = boolean>(
  subject: TSubject | unknown
): subject is TSubject => typeof subject === 'boolean';
