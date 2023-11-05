/**
 * Goal: Understand object literal intersection
 *
 * Answers:
 * - TS cannot correctly infer the resulting intersection of type literals => not typed as `never` even when it should.
 */

import { assertNever } from "./utils.js";

type A = `a_${string}`;
type B = `b_${string}`;

// @ts-expect-error
const aAndB: A & B = "a_ok";

// @ts-expect-error - it's essentially never, but TypeScript isn't able to figure it out with string literals
assertNever(aAndB);
