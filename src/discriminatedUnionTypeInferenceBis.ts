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

let coherentTypeTest: expectedType;
const coherentTypeTestBis: expectedTypeCorrectlyDistributed = coherentTypeTest;

console.log(coherentTypeTestBis);
