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
