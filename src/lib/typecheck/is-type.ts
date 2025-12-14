import { IsTypeKey } from '../types/is-type-key.type';
import { IsTypeKeyType } from '../types/is-type-key-type.type';
import { isBigInt } from './is-big-int';
import { isBoolean } from './is-boolean';
import { isDate } from './is-date';
import { isError } from './is-error';
import { isFunction } from './is-function';
import { isNull } from './is-null';
import { isNumber } from './is-number';
import { isRegExp } from './is-reg-exp';
import { isString } from './is-string';
import { isSymbol } from './is-symbol';
import { isUndefined } from './is-undefined';

/**
 * TypeScript aware type checking
 *
 * The type evaluating nature of this function also doesn't allow
 * subject to be typed `unknown` or similar.
 * For this special case there is no other way but `any`,
 * because it would otherwise mess with the called functions input type.
 */
export const isType = <TKey extends IsTypeKey, TSubject>(
  subject: TSubject | unknown,
  checkType: TKey
): subject is IsTypeKeyType<TKey> => {
  switch (checkType) {
    case 'bigint':
      return isBigInt(subject);
    case 'boolean':
      return isBoolean(subject);
    case 'Date':
      return isDate(subject);
    case 'Error':
      return isError(subject);
    case 'Function':
      return isFunction(subject);
    case 'number':
      return isNumber(subject);
    case 'RegExp':
      return isRegExp(subject);
    case 'string':
      return isString(subject);
    case 'undefined':
      return isUndefined(subject);
    case 'null':
      return isNull(subject);
    case 'symbol':
      return isSymbol(subject);
  }
  return false;
};
