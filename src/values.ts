import { purry } from './purry';

type Values<T extends object> = T extends ReadonlyArray<unknown> | []
  ? Array<T[number]>
  : Array<T[keyof T]>;

/**
 * Returns a new array containing the values of the array or object.
 * @param source Either an array or an object
 * @signature
 *    R.values()(source)
 * @example
 *    R.pipe(['x', 'y', 'z'], R.values()) // => ['x', 'y', 'z']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.values()) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.values(),
 *      R.first(),
 *    ) // => 'x'
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 * @pipeable
 * @category Object
 * @dataFirst
 * @dataLast
 */
export function values<T>(
  data?: T
): T extends object
  ? Values<T>
  : undefined extends T
    ? <T2 extends object>(source: T2) => Values<T2>
    : never;

export function values() {
  return purry(Object.values, arguments);
}
