# CSPS

Tools to solve [constraint satisfaction problems](https://en.wikipedia.org/wiki/Constraint_satisfaction_problem): **C**onstraint **S**atisfaction **P**roblem **S**olvers.

![npm](https://img.shields.io/npm/v/csps.svg)
![Node](https://img.shields.io/badge/node-%3E%3D10-blue.svg?cacheSeconds=2592000)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/csps.svg)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/charkour/csps/CI.svg)

> Inspired by [Russell and Norvig's "Artificial Intelligence - A Modern Approach" Python code](https://github.com/aimacode/aima-python) and modified under the MIT license.

## Background

A CSP is a specific type of problem that is represented by states and a goal state. The factored representation of each problem state consists of a set of variables and a value for each (set of attributes). The problem is considered solve, when all values for each variable satisfy all constraints (Russell, Norvig 2010).

Some example of CSPs would be Sudoku, scheduling, map-coloring, n-queens. The tools in this CSPS package help setup and solve CSPs.

## Installation and Example Usage

install:

```sh
npm i csps
```

index.ts:

```ts
import { CSP, min_conflicts } from "csps";

// Setup your problem
const variables = [
  /* array of strings */
];
const domains = {
  /* var: possible_attributes<string>[] */
};
const neighbors = {
  /* var: neighbors<string>[] */
};
const constraints = (
  var1: string,
  var1Attributes: string[],
  var2: string,
  var2Attributes: string[],
): boolean => {
  // Return true if same variable.
  if (var1 === var2) {
    return true;
  }

  // more constraints that return false...

  // else, return true
  return true;
};

const aCSP = new CSP<string>(variables, domains, neighbors, constraints);

// run min_conflicts on problem
const res = min_conflicts(aCSP);
console.log(res);
```

View the [example](https://github.com/charkour/csps/tree/main/example) for working code.

## Contributing

Please feel free to create issues or make PRs.
