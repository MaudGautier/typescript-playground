/**
 * Goal: Understand how to circumvent the limitations of discriminated union types by using the fact that conditional
 * types have the property to distribute over unions.
 *
 * Answers:
 * - Type literal `${arg.type}:${arg.value}` will create all possible combinations
 * - If we want to have only the 'correct' combinations (i.e. one for each 'arg'), we can either:
 *    + Narrow types on one discriminant property (switch case in `buildLiteralOkButSad`) --> See resource 1
 *    + Distribute, via recreating another expected type using the conditional types, which distribute over unions
 *      (cf `asLiteral` example) --> See resource 2
 *
 * Resources:
 * - https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/#cfa-destructured-discriminated-unions
 * - https://stackoverflow.com/questions/62084836/what-does-it-mean-for-a-type-to-distribute-over-unions
 */

type A = {
  type: "a";
  value: "string a";
};

type B = {
  type: "b";
  value: "string b";
};

type C = A | B;

const a: A = { type: "a", value: "string a" };
const b: B = { type: "b", value: "string b" };

const c: C = a;

type expectedType = "a:string a" | "b:string b";

// what TS infers:
// type expectedTypeWrong = `${C['type']}:${C['value']}`;
function buildLiteralError(arg: C): expectedType {
  // @ts-expect-error
  return `${arg.type}:${arg.value}`;
}

function buildLiteralOkButSad(arg: C): expectedType {
  switch (arg.type) {
    case "a":
      return `${arg.type}:${arg.value}`;
    case "b":
      return `${arg.type}:${arg.value}`;
  }
}

console.log(a);
console.log(b);
console.log(c);
console.log(buildLiteralError);
console.log(buildLiteralOkButSad);

// it is possible in type-world to build the correct type automatically.
// But it's not: type expectedTypeWrong = `${C['type']}:${C['value']}`;
// keywords: 'type distribution over union' or something.
type asLiteral<T> = T extends C ? `${T["type"]}:${T["value"]}` : never;
type expectedTypeCorrectlyDistributed = asLiteral<C>;

let coherentTypeTest!: expectedType; // Adding ! to silence the non assigned error
const coherentTypeTestBis: expectedTypeCorrectlyDistributed = coherentTypeTest;

console.log(coherentTypeTestBis);
