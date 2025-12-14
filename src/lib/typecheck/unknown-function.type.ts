/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
declare function janeDoeFunction(...args: any[]): any;
declare function janeDoeFunction(): any;
/**
 * Function of any kind
 */
export type UnknownFunction = typeof janeDoeFunction;
