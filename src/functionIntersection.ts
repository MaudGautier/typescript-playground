/**
 * Goal: Understand function intersection
 *
 * Answers:
 * - Intersection of functions <--> Acts on the union of parameters <--> Overloaded function that accepts BOTH params.
 * - FunctionA & FunctionB (Function<ArgA | ArgB>) is a subset of Function<ArgA>.
 *
 * Resources:
 * - https://stackoverflow.com/a/43673223
 * - https://stackoverflow.com/a/58632009
 * - https://stackoverflow.com/a/70741721
 */

type ArgA = 1 | 2 | 3;
type ArgB = 3 | 4 | 5;

type FunctionA = (arg: ArgA) => void;
type FunctionB = (arg: ArgB) => void;

type FunctionAAndB = FunctionA & FunctionB;

type FunctionWithUnionOfArgs = (arg: ArgA | ArgB) => void;

/**
 * The intersection of functions corresponds to a function with the union of parameters passed.
 * This is something that corresponds to an overloaded function; you can call it both ways.
 *
 * Intersection of functions <--> Acts on the union of parameters.
 */
// NB: If ArgA|ArgB not explicitly defined => inferred as 1|2|3|4|5 (i.e. ArgA|ArgB)
const bothAAndB: FunctionAAndB = (arg: ArgA | ArgB) => {
  console.log("arg", arg);
  return;
};

// Accepts ArgA
bothAAndB(1);
// Accepts ArgB
bothAAndB(4);
// @ts-expect-error: Argument outside the union of ArgA | ArgB
bothAAndB(7);

/**
 * Shows that S<ArgA | ArgB> is a subset of S<ArgA> 🤯
 *
 * Good mental model:
 * - FunctionA accepts ArgA (S<ArgA>)
 * - FunctionB accepts ArgB (S<ArgB>)
 * - FunctionA & FunctionB (S<ArgA | ArgB>):
 *    + accepts ArgA
 *    + accepts ArgB
 */
type S<T> = (arg: T) => void;

// right hand side: function of type (arg: ArgA | ArgB) => void
// left hand side: S<ArgA>
// is the right hand side type a subset of the left hand side type ? 🤯 --> Yes
const unionOfParametersIsMoreRestrictedThanEach: S<ArgA> = (arg: ArgA | ArgB) => {
  console.log("arg", arg);
  return;
};

// But the other way round is *NOT* true:

// @ts-expect-error: Function expecting ArgA does not fit in function expecting ArgA | ArgB
const functionWithOneParamAIsBroaderThanUnion: FunctionWithUnionOfArgs = (arg: ArgA) => {
  console.log(arg);
};
// @ts-expect-error: Function expecting ArgB does not fit in function expecting ArgA | ArgB
const functionWithOneParamBIsBroaderThanUnion: FunctionWithUnionOfArgs = (arg: ArgB) => {
  console.log(arg);
};

/**
 * Another way to see the equivalence is by using the `satisfies` operator.
 * FunctionAAndB <--> FunctionWithUnionOfArgs
 */
const functionAandB: FunctionAAndB = ((arg: ArgA | ArgB) => {
  console.log(arg);
}) satisfies FunctionWithUnionOfArgs;
const functionWithUnionOfArgs: FunctionWithUnionOfArgs = ((arg: ArgA | ArgB) => {
  console.log(arg);
}) satisfies FunctionAAndB;
functionAandB(1);
functionAandB(5);
// @ts-expect-error: Argument passed is outside the union of accepted values
functionAandB(6);
functionWithUnionOfArgs(1);
functionWithUnionOfArgs(5);
// @ts-expect-error: Argument passed is outside the union of accepted values
functionWithUnionOfArgs(6);

/**
 * As a side note, we don't have the problem if we use generics
 */
type GenericFunction<Arg extends ArgA | ArgB> = (arg: Arg) => void;
const genericFunctionArgA: GenericFunction<ArgA> = (arg: ArgA) => {
  console.log(arg);
};
const genericFunctionArgB: GenericFunction<ArgB> = (arg: ArgB) => {
  console.log(arg);
};

/**
 * Ignore TS6133 error (variable not used)
 */
function ignoreTS6133VariableNotUsed() {
  console.log("unionOfParametersIsMoreRestrictedThanEach", unionOfParametersIsMoreRestrictedThanEach);
  console.log("functionWithOneParamAIsBroaderThanUnion", functionWithOneParamAIsBroaderThanUnion);
  console.log("functionWithOneParamBIsBroaderThanUnion", functionWithOneParamBIsBroaderThanUnion);
  console.log("genericFunctionArgA", genericFunctionArgA);
  console.log("genericFunctionArgB", genericFunctionArgB);
}

ignoreTS6133VariableNotUsed();
