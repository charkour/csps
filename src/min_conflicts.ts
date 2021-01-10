/* Min-conflicts hill-climbing search for CSPs functions */

import { CSP } from "./csp";
import { LooseObject } from "./interfaces";
import { argmin_random_tie, random_choice } from "./utils";

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
