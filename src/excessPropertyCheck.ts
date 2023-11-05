/**
 * Goal: Understand excess property checking on object literal
 *
 * Answers:
 * - TS does "excess property checking" on object literals: it takes the stance that if there is one property not
 * expected => it must be a bug.
 * - We can bypass this verification by passing the object literal in a variable: the variable won't undergo excess
 * property checking when passed to a function.
 * - Nonetheless, for this to be bypassed, it is required that at least one property is in common between the variable
 * and the expectations (different TS error with code TS2559 otherwise).
 *
 * Documentation: https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
 */
type MinimalProps = {
  prop1?: string;
  prop2?: string;
};

function myFuncExpectingMinimalProps(props: MinimalProps) {
  console.log(props);
}

const myVarWithMinimalProps: MinimalProps = { prop1: "prop1", prop2: "prop2" };
const myVarWithExtraProp = {
  ...myVarWithMinimalProps,
  extraProp: "extraProp",
};
// The type of "myVarWithExtraProp" is inferred from the template literal passed:
// ({extraProp: string, prop1?: string | undefined, prop2?: string | undefined})

/**
 * This fails because of excess property checking (passing more props than expected - TS feature)
 */
const failBecauseOfExcessPropertyCheck: MinimalProps = {
  ...myVarWithMinimalProps,
  // @ts-expect-error: Excess property checking
  extraProp: "extraProp",
};

/**
 * Funnily: It seems that TS waits for having seen all expected properties, and then does the check on the properties
 * that are passed AFTERWARD. Only if there is no problem afterward, it checks for properties passed BEFORE.
 *
 * Here: Fails on the "extraProp" passed after all expected props, but not on "yetAnotherProp" passed before.
 */
const failBecauseOfExcessPropertyCheck2: MinimalProps = {
  // Funnily: doesn't fail (but does if extraProp below is removed => what's above expected props is checked afterward)
  yetAnotherProp: "yetAnotherOne",
  ...myVarWithMinimalProps,
  // @ts-expect-error: First excess property found (after all expected properties have been found)
  extraProp: "extraProp",
};

/**
 * Funnily: It seems that TS waits for having seen all expected properties, and then does the check on the properties
 * that are passed AFTERWARD. Only if there is no problem afterward, it checks for properties passed BEFORE.
 *
 * Here: Fails on the "extraProp" passed before the expected props, because no excess prop after them.
 */
const failBecauseOfExcessPropertyCheck3: MinimalProps = {
  // @ts-expect-error: Fails because it is the first excess property found (search above, when all below are validated)
  extraProp: "extraProp",
  ...myVarWithMinimalProps,
};

/**
 * The same occurs when passed to a function: Excess property checking => TS error
 */
// @ts-expect-error: Excess property checking
myFuncExpectingMinimalProps({ ...myVarWithMinimalProps, extraProp: "extraProp" });

/**
 * Excess property checking can be bypassed by passing the object literal to a variable first (No excess property
 * checking done on variables, only on object literals).
 */
const bypassExcessPropertyCheck: MinimalProps = myVarWithExtraProp;

/**
 * Same when passed to a function: No excess property checking done on the variable passed
 */
myFuncExpectingMinimalProps(myVarWithExtraProp);

/**
 * Nonetheless, the error comes back when there is no common property found in the variable passed
 */
const myVarWithExtraPropsButNoCommonProp = { extraProp: "extraProp" };
// @ts-expect-error: No common prop => TS error (NB: different code: TS2559, instead of TS2345 for excess prop checking)
myFuncExpectingMinimalProps(myVarWithExtraPropsButNoCommonProp);
const myVarWithExtraPropAndOneCommonProp = { prop1: "", extraProp: "extraProp" };
// One common prop => no error (no excess property checking)
myFuncExpectingMinimalProps(myVarWithExtraPropAndOneCommonProp);

/**
 * Ignore TS6133 error (variable not used)
 */
function ignoreTS6133VariableNotUsed() {
  console.log({
    bypassExcessPropertyCheck,
    failBecauseOfExcessPropertyCheck,
    failBecauseOfExcessPropertyCheck2,
    failBecauseOfExcessPropertyCheck3,
  });
}

ignoreTS6133VariableNotUsed();
