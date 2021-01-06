/* Min-conflicts hill-climbing search for CSPs functions */

import { CSP } from "./csp";
import { LooseObject } from "./interfaces";

/**
 * Solve a CSP by stochastic hill-climbing on the number of conflicts.
 *
 * @param  {CSP<T>} aCSP
 * @param  {number=100000} max_steps
 * @returns LooseObject
 */
export const min_conflicts = <T extends string>(
  aCSP: CSP<T>,
  max_steps: number = 100000,
): LooseObject<T[]> | undefined => {
  // Generate a complete assignment for all variables (probably with conflicts)
  let current: LooseObject<T[]> = {};
  aCSP.variables.forEach(variable => {
    const val = min_conflicts_value<T>(aCSP, variable as T, current);
    aCSP.assign(variable as T, val, current);
  });

  // Now repeatedly choose a random conflicted variable and change it
  for (let i = 0; i < max_steps; i++) {
    const conflicted = aCSP.conflicted_vars(current);
    if (!(conflicted.length > 0)) {
      return current;
    }
    const variable = random_choice(conflicted);
    const val = min_conflicts_value(aCSP, variable, current);
    aCSP.assign(variable, val, current);
  }
  // If no solution can be found.
  return undefined;
};

/**
 * Return the value that will give var the least number of conflicts.
 * If there is a tie, choose at random.
 *
 * @param  {CSP<T>} aCSP
 * @param  {T} variable
 * @param  {LooseObject<T[]>} current
 * @returns T
 */
export const min_conflicts_value = <T extends string>(
  aCSP: CSP<T>,
  variable: T,
  current: LooseObject<T[]>,
): T[] => {
  const num_conflicts = (val: T[]) => aCSP.nconflicts(variable, val, current);
  return argmin_random_tie(aCSP.domains[variable], num_conflicts);
};

/**
 * Return a random element from an array.
 *
 * @param  {T[]} arr
 * @returns T
 * Ref: https://stackoverflow.com/a/4550514/9931154
 */
export const random_choice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffle the values of an array using Durstenfeld shuffle
 * Returns a copy of the array.
 *
 * @param  {any[]} arr
 * @returns any
 * Ref: https://stackoverflow.com/a/12646864/9931154
 */
export const shuffle_array = (arr: any[]): any[] => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Returns the paramter
 *
 * @param  {any} val
 * @returns any
 */
export const identity = (val: any): any => val;

/**
 * Return a minimum element of seq; break ties at random.
 *
 * @param  {any[]} seq
 * @param  {(val:any)=>number=identity} key
 * @returns any
 * Ref for reduce(): https://stackoverflow.com/a/31844649/9931154
 */
export const argmin_random_tie = (
  seq: any[],
  // seq: T[][], // TODO: Is this better?
  key: (val: any) => number = identity,
): any => {
  return shuffle_array(seq).reduce((prev, curr) => {
    return key(prev) < key(curr) ? prev : curr;
  });
};
