# csps

Tools to solve [constraint satisfaction problems](https://en.wikipedia.org/wiki/Constraint_satisfaction_problem): **C**onstraint **S**atisfaction **P**roblem **S**olvers.

[![npm version](https://img.shields.io/npm/v/csps.svg)](https://www.npmjs.com/package/csps)
![node >= 10](https://img.shields.io/badge/node-%3E%3D10-blue.svg?cacheSeconds=2592000)
[![size < 1k](https://img.shields.io/bundlephobia/minzip/csps.svg)](https://www.npmjs.com/package/csps)
[![build status](https://img.shields.io/github/workflow/status/charkour/csps/CI.svg)](https://github.com/charkour/csps)
[![zero deps](https://img.shields.io/david/charkour/csps)](https://www.npmjs.com/package/csps)
[![downloads](https://img.shields.io/npm/dt/csps.svg)](https://www.npmjs.com/package/csps)

> Inspired by [Russell and Norvig's "Artificial Intelligence - A Modern Approach" Python code](https://github.com/aimacode/aima-python) and modified under the MIT license.

## Background

A CSP is a specific type of problem that is represented by states and a goal state. The factored representation of each problem state consists of a set of variables and a value (set of attributes) for each. The problem is considered solve, when all values for each variable satisfy all constraints (Russell, Norvig 2010).

Some example of CSPs would be Sudoku, crosswords, scheduling, map-coloring, n-queens, zebra puzzle, and many others. The tools in this `csps` package help setup and solve CSPs.

## Installation and Example Usage

install:

```sh
npm i csps
```

index.ts:

```ts
import { CSP, min_conflicts } from "csps";

// define the attributes on your variable
interface VariableAttributes {
  // {[key: string]: string}
}

// Setup your problem
const variables = [
  /* array of strings */
];
const domains = {
  /* var: possible_attributes (type: VariableAttributes[]) */
};
const neighbors = {
  /* var: neighbors (type: <string>[]) */
};
const constraints = (
  var1: string,
  var1Attributes: VariableAttributes[],
  var2: string,
  var2Attributes: VariableAttributes[],
): boolean => {
  // Return true if same variable.
  if (var1 === var2) {
    return true;
  }

  // more constraints that return false...

  // else, return true
  return true;
};

const aCSP = new CSP<VariableAttributes>(variables, domains, neighbors, constraints);

// run min_conflicts on problem
const res = min_conflicts(aCSP);
console.log(res);
// {
//   var1: { attr1: 'value1', attr2: 'value1', attr3: 'value1' },
//   var2: { attr1: 'value2', attr2: 'value2', attr3: 'value2' },
//   var3: { attr1: 'value3', attr2: 'value3', attr3: 'value3' },
// } // or something similar.
```

### Demo

View the [example](https://github.com/charkour/csps/tree/main/example) for more in-depth example code.

## API

### Search Functions

Currently, Min-conflicts Hill Climbing is the only search function supported.

- [x] Min-conflicts Hill Climbing
- [ ] AC3
- [ ] AC3b
- [ ] AC4
- [ ] Backtracking

Please view the [docs](https://charkour.github.io/csps/) to see the full API.

## Contributing

Please feel free to create issues or make PRs.

## Acknowledgements

- Thank you to Russell and Norvig for their _AIMA_ textbook and code.
- Thank you to TSDX, TypeDoc, and other open source packages that made this package possible.
