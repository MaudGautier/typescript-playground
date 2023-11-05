/**
 * Goal: Understand why union types structure are not conserved when passed down to a child function.
 *
 * Answers:
 * - When an object is destructured, each element's type is inferred individually, but the relationship (person XOR
 * business), i.e. the discriminated union type, is lost.
 * - When the whole object is passed, the relationship (person XOR business), i.e. the discriminated union type, is
 * conserved.
 * - The object can be spread. As long as it is not destructured, the discriminated union type is conserved.
 * - Even after destructuring, TS can infer the correct type of each property if we use a discriminant property (i.e.
 * discriminated union type can be restored).
 *
 * Resources:
 * - https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/#cfa-destructured-discriminated-unions
 */
import { assertString, assertUndefined } from "./utils.js";

type WithPersonIdXorBusinessId =
  | {
      personId: string;
      businessId?: never;
    }
  | {
      personId?: never;
      businessId: string;
    };

function childFunc({ personId, businessId }: WithPersonIdXorBusinessId) {
  console.log({ personId, businessId });
  return;
}

function myFuncPassingDestructuredObject({ personId, businessId }: WithPersonIdXorBusinessId) {
  // @ts-expect-error: Object is destructured => discriminated union type inference (either person XOR business) is lost
  return childFunc({ personId, businessId });
}

/**
 * Works ! 🎉
 * Object is passed wholly => discriminated union type inference is conserved
 */
function myFuncPassingWholeObject(a: WithPersonIdXorBusinessId) {
  return childFunc(a);
}

function myFuncUsingAccessProperties(a: WithPersonIdXorBusinessId) {
  // @ts-expect-error: Object is destructured => discriminated union type inference is lost
  return childFunc({ personId: a.personId, businessId: a.businessId });
}

/**
 * 🤯 There is still hope !
 * When spreading but not destructured => discriminated union type inference is conserved
 */
function myFuncSpread(a: WithPersonIdXorBusinessId) {
  return childFunc({ ...a });
}

/**
 * With extra property (and spread but not destructured) => Works ! 🎉
 */
function childFuncWithExtraProp({
  personId,
  businessId,
  otherProp,
}: WithPersonIdXorBusinessId & {
  otherProp: string;
}) {
  console.log({ personId, businessId, otherProp });
  return;
}

function myFuncSpreadWithExtraProp(a: WithPersonIdXorBusinessId) {
  return childFuncWithExtraProp({ otherProp: "1", ...a });
}

/**
 * If we use the discriminant property to infer the correct types each time => Works ! 🎉
 */
function myFuncWithDiscriminantProperty(personOrBusiness: WithPersonIdXorBusinessId) {
  const { personId, businessId } = personOrBusiness;
  // At this stage, personId and businessId are both typed as string | undefined (because of the destructuration)

  // When we use the discriminant property, we know that only one of the two is defined
  if (typeof personId === "string") {
    assertString(personId);
    assertUndefined(businessId);
    // @ts-expect-error
    assertString(businessId);
    // @ts-expect-error
    assertUndefined(personId);
    childFunc({ personId, businessId });
  } else {
    assertString(businessId);
    assertUndefined(personId);
    // @ts-expect-error
    assertString(personId);
    // @ts-expect-error
    assertUndefined(businessId);
    childFunc({ personId, businessId });
  }
}

/**
 * Ignore TS6133 error (variable not used)
 */
function ignoreTS6133VariableNotUsed() {
  console.log("myFuncPassingDestructuredObject", myFuncPassingDestructuredObject);
  console.log("myFuncUsingAccessProperties", myFuncUsingAccessProperties);
  console.log("myFuncPassingWholeObject", myFuncPassingWholeObject);
  console.log("myFuncSpread", myFuncSpread);
  console.log("myFuncSpreadWithExtraProp", myFuncSpreadWithExtraProp);
  console.log("myFuncWithDiscriminantProperty", myFuncWithDiscriminantProperty);
}

ignoreTS6133VariableNotUsed();
