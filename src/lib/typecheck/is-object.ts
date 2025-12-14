import { notNil } from './not-nil';

/**
 * Checks if value is array.
 *
 * @param subject - the subject
 */
export const isObject = <TSubject extends object>(
  subject: TSubject | null | undefined | unknown
): subject is TSubject =>
  !notNil(subject) && typeof subject === 'object' && !Array.isArray(subject);
