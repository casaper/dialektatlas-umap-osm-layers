import { UnknownFunction } from './unknown-function.type';

/**
 * Checks if value is classified as a Function object.
 *
 * @param subject - the function or not
 */
export const isFunction = <
  TFunc extends UnknownFunction,
  TParams extends Parameters<TFunc>,
  TReturnType extends ReturnType<TFunc>,
  TIsFn extends (...args: TParams) => TReturnType,
>(
  subject: TFunc | unknown
): subject is TIsFn => typeof subject === 'function';
