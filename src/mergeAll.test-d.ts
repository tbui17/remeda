import { mergeAll } from "./mergeAll";

it("custom case", () => {
  // based on https://github.com/remeda/remeda/issues/918
  type UserWithPhone = { id: string; phone: number };
  type UserWithPhoneAsString = { id: string; phone: string };
  type UserWithName = { id: string; name: string; optianalTitle?: string };
  type UserUnion = UserWithName | UserWithPhone | UserWithPhoneAsString;
  const userUnionArray: ReadonlyArray<UserUnion> = [];

  type ExpectedResultType =
    | {
        id: string;
        phone?: string | number;
        name?: string;
        optianalTitle?: string;
      }
    | object;

  const mergedUserUnion = mergeAll(userUnionArray);

  expectTypeOf(mergedUserUnion).toEqualTypeOf<ExpectedResultType>();
});

describe("optionality", () => {
  it("should preserve optionality of optional fields", () => {
    type A = { a: undefined };
    type B = { a: undefined; b?: string };
    const input: ReadonlyArray<A | B> = [];

    type ExpectedResultType = { a: undefined; b?: string } | object;

    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });

  it("should have non-optional fields shared across all members of the union remain non-optional, with the rest becoming optional regardless of their original optionality", () => {
    type A = { a: number; b: string };
    type B = { a: number; c?: string; b: string };
    type C = { a: number; d: string };

    type ExpectedResultType =
      | { a: number; b?: string; c?: string; d?: string }
      | object;

    const input: ReadonlyArray<A | B | C> = [];
    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });

  it("should preserve optionality of optional fields that are shared across all union members", () => {
    type A = { a?: number };
    type B = { a?: number };
    type C = { a?: number };

    type ExpectedResultType = { a?: number } | object;

    const input: ReadonlyArray<A | B | C> = [];
    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });

  it("should prefer optional over non-optional when the same field across all members of the union has different optionalities", () => {
    type A = { a?: number };
    type B = { a: number };
    type C = { a?: number };

    type ExpectedResultType = { a?: number } | object;

    const input: ReadonlyArray<A | B | C> = [];
    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });
});

describe("should merge different types on same fields into a union", () => {
  it("when the types are different, they form a union", () => {
    type A = { a: number; b: string };
    type B = { a: string; b: string };
    const input: ReadonlyArray<A | B> = [];

    type ExpectedResultType = { a: string | number; b: string } | object;

    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });

  it("when the fields are unions, they are combined into a single union", () => {
    type A = { a: number | boolean; b: string };
    type B = { a: string | Date; b: string };
    const input: ReadonlyArray<A | B> = [];

    type ExpectedResultType =
      | { a: string | number | boolean | Date; b: string }
      | object;

    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });

  it("when the field has two different intersections, it becomes the union of the intersections", () => {
    type IntersectionAPart1 = { a1: string };
    type IntersectionAPart2 = { b1: string };
    type IntersectionA = IntersectionAPart1 & IntersectionAPart2;
    type IntersectionBPart1 = { a2: string };
    type IntersectionBPart2 = { b2: string };
    type IntersectionB = IntersectionBPart1 & IntersectionBPart2;
    type A = { a: IntersectionA; b: string };
    type B = { a: IntersectionB; b: string };
    const input: ReadonlyArray<A | B> = [];

    type ExpectedResultType =
      | { a: IntersectionA | IntersectionB; b: string }
      | object;

    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<ExpectedResultType>();
  });
});
