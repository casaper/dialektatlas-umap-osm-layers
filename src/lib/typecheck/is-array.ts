/**
 * Checks if value is array.
 *
 * @param subject - the subject
 */
export const isArray = <TSubject>(
  subject: TSubject[] | unknown
): subject is TSubject[] => Array.isArray(subject);
