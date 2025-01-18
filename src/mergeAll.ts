import type { Merge } from "type-fest";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Merges a tuple of objects types into a single object type from left to right.
 */
type MergeTuple<
  T extends IterableContainer,
  Result = object, // no-op for the first iteration in the successive merges, also infers object as type by default if an empty tuple is used
> = T extends readonly [infer Head, ...infer Rest]
  ? MergeTuple<Rest, Merge<Result, Head>>
  : Result;

/**
 * Merges a list of objects into a single object.
 *
 * @param objects - The array of objects.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 * @category Array
 */
export function mergeAll<T extends IterableContainer>(
  objects: T,
): MergeTuple<T>;
export function mergeAll(array: ReadonlyArray<object>): object;

export function mergeAll(items: ReadonlyArray<object>): object {
  let out = {};

  for (const item of items) {
    out = { ...out, ...item };
  }

  return out;
}
