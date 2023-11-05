/**
 * Goal: Understand function union
 *
 * Answers:
 * - Union of functions <--> Acts on the intersection of parameters, i.e. A union of functions can only safely act on
 * the intersection of their parameters.
 * - A union of functions expects more restricted parameters than either function type separately, i.e.:
 * FunctionA | FunctionB (Function<ArgA & ArgB>) is a superset of Function<ArgA>.
 *
 * Resources:
 * - https://stackoverflow.com/a/58632009
 * - https://stackoverflow.com/a/71340801
 */

type ArgA = 1 | 2 | 3;
type ArgB = 3 | 4 | 5;
type ArgObjectC = { c: string };
type ArgObjectD = { d: string };

type FunctionA = (arg: ArgA) => void;
type FunctionB = (arg: ArgB) => void;
type FunctionC = (arg: ArgObjectC) => void;
type FunctionD = (arg: ArgObjectD) => void;

type FunctionAOrB = FunctionA | FunctionB;
type FunctionCOrD = FunctionC | FunctionD;
type FunctionWithIntersectionOfArgs = (arg: ArgA & ArgB) => void;

/**
 * The union of functions corresponds to a function with the intersection of parameters passed.
 *
 * Union of functions <--> Acts on the intersection of parameters.
 */
const eitherAOrB: FunctionAOrB = (arg: any) => {
  console.log("arg", arg);
  return;
};
// Functionally, it works: only arguments that correspond to the intersection don't render an error
// @ts-expect-error: 1 is not in the intersection of ArgA & ArgB
eitherAOrB(1);
eitherAOrB(3);
// @ts-expect-error: 5 is not in the intersection of ArgA & ArgB
eitherAOrB(5);

// @ts-expect-error: Weirdly, `(arg: ArgA & ArgB) => void` is not assignable to FunctionAOrB
// I don't understand why, but it seems that type inference of args doesn't work as smoothly as in the case of function
// intersection... 🤯 (even though it works functionally, cf above)
const eitherAOrBBis: FunctionAOrB = (arg: ArgA & ArgB) => {
  console.log("arg", arg);
  return;
};

// Similarly: on functions taking objects as arguments (but easier to think of it, cf explanation below)
const functionCOrD: FunctionCOrD = (arg: any) => {
  console.log(arg);
};
const cAndD: ArgObjectC & ArgObjectD = { c: "", d: "" };
functionCOrD(cAndD);
const cOrD: ArgObjectC | ArgObjectD = { c: "" };
// @ts-expect-error: FunctionC can work safely only if "c" is passed; FunctionD can work safely only if "d" is passed,
// But one of them not given => one of the functions called is likely to fail
functionCOrD(cOrD);

/**
 * Useful explanation from https://stackoverflow.com/a/71340801
 *
 * The problem here is that a union of functions is more restrictive than either function type separately.
 * It's only safe to pass in a Foo to a Func<Foo>, and it's only safe to pass in a Bar to a Func<Bar>.
 * And if you don't know if your function is a Func<Foo> or a Func<Bar>, the only safe thing you could possibly pass
 * in would have to be both a Foo and a Bar. That is, Foo & Bar, the intersection:
 *
 * const intersectionArg: Foo & Bar = { a: "hello", b: "goodbye" }
 * func(intersectionArg) // probably GOODBYE, occasionally HELLO, never runtime error
 *
 * The intersectionArg is both a Foo and a Bar because it has both a string-valued a property and a string-valued b
 * property. Calling func(intersectionArg) is always safe, because no matter which function body ends up being executed,
 * the parameter will definitely have the expected property.
 */

/**
 * Shows that S<ArgA> is a subset of S<ArgA & ArgB> 🤯
 *
 * A (somewhat) good mental model:
 * - FunctionA | FunctionB: don't know if FunctionA or FunctionB used => safe only if intersection of ArgA & ArgB:
 *    + accepts only ArgA & ArgB (S<ArgA & ArgB>), i.e. all properties of ArgA AND all properties of ArgB are required.
 * - FunctionA is only one part of FunctionA | FunctionB => is a subset.
 *    + FunctionA can accept ArgA, or the more restricted intersection of parameters ArgA & ArgB.
 */
type S<T> = (arg: T) => void;

const functionWithIntersectionOfArgsA: FunctionWithIntersectionOfArgs = (arg: ArgA) => {
  console.log(arg);
};
const functionWithIntersectionOfArgsB: FunctionWithIntersectionOfArgs = (arg: ArgB) => {
  console.log(arg);
};

// But the other way round is *NOT* true:

// @ts-expect-error: the intersection of parameters is less restricted than each
const intersectionOfParametersIsLessRestrictedThanEach: S<ArgA> = (arg: ArgA & ArgB) => {
  console.log("arg", arg);
  return;
};

/**
 * Another way to see the equivalence is by using the `satisfies` operator.
 * (Doesn't work as well as for function intersection) 🤯
 * FunctionAOrB <--> FunctionWithIntersectionOfArgs
 *
 * Functionally, it works well (even though some weird stuff with matching ArgA & ArgB to FunctionAOrB)
 */

// @ts-expect-error: Somehow, things don't work well with satisfies in the union of functions case 🤯
// Nonetheless, arg is correctly inferred as ArgA & ArgB
const functionAOrB: FunctionAOrB = ((arg) => {
  console.log(arg);
}) satisfies FunctionWithIntersectionOfArgs;
const functionWithIntersectionOfArgs: FunctionWithIntersectionOfArgs = ((arg: ArgA & ArgB) => {
  console.log(arg);
  // @ts-expect-error: Somehow, things don't work well with satisfies in the union of functions case 🤯
}) satisfies FunctionAOrB;

// @ts-expect-error: Argument passed is outside the intersection of accepted values
functionAOrB(1);
functionAOrB(3);
// @ts-expect-error: Argument passed is outside the intersection of accepted values
functionAOrB(5);
console.log(functionAOrB);
// @ts-expect-error: Argument passed is outside the intersection of accepted values
functionWithIntersectionOfArgs(1);
functionWithIntersectionOfArgs(3);
// @ts-expect-error: Argument passed is outside the intersection of accepted values
functionWithIntersectionOfArgs(5);

/**
 * Ignore TS6133 error (variable not used)
 */
function ignoreTS6133VariableNotUsed() {
  console.log("eitherAOrBBis", eitherAOrBBis);
  console.log("functionWithIntersectionOfArgsA", functionWithIntersectionOfArgsA);
  console.log("functionWithIntersectionOfArgsB", functionWithIntersectionOfArgsB);
  console.log("intersectionOfParametersIsLessRestrictedThanEach", intersectionOfParametersIsLessRestrictedThanEach);
}

ignoreTS6133VariableNotUsed();
