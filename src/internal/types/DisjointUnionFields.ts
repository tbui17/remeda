import type { KeysOfUnion, SharedUnionFields } from "type-fest";

/**
 * Gets the complement of the keys of {@link SharedUnionFields} from a union.
 */
type SharedUnionFieldKeysComplement<T extends object> = Exclude<
  KeysOfUnion<T>,
  keyof SharedUnionFields<T>
>;

/**
 * Gets the complement of {@link SharedUnionFields} from a union.
 */
export type DisjointUnionFields<T extends object> = {
  [K in SharedUnionFieldKeysComplement<T>]: T extends Partial<
    Record<K, unknown>
  > // if T contains K (distributed, can be optional)
    ? T[K]
    : never;
};
