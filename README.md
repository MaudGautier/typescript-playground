# Typescript playground

This project is a small playground for me to experiment and better understand some behaviors of TypeScript.

## Getting started

```
# Install dependencies
npm install

# Compile and check for TS errors
npm run tsc

# Run prettier
npm run prettier
```

## Experiments

- `discriminatedUniontTypeInference` - Understand why union types structure are not conserved when passed down to a
  child function:
  - Linked to destructuring which breaks links between union types
  - Can be restored by using a discriminant property.
- `excessPropertyCheck` - Understand excess property checking on object literal:
  - Done on object literal
  - Can be bypassed when using an intermediary variable
  - The intermediary variable needs to have at least one property in common (otherwise, other TS error).
- `functionIntersection` & `functionUnion` - Understand function intersection & union:
  - Intersection of functions <--> Acts on the union of parameters (overloaded function that accepts BOTH parameters)
  - Union of functions <--> Acts on the intersection of parameters (acts safely ONLY if intersection of parameters,
    i.e. if each function can deal individually with all possible parameters passed)
  - FunctionA & FunctionB (Function<ArgA | ArgB>) is a subset of Function<ArgA>
  - FunctionA | FunctionB (Function<ArgA & ArgB>) is a superset of Function<ArgA>
