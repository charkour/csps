/* Min-conflicts hill-climbing search for CSPs functions */

import { CSP } from "./csp";
import { CurrentDomain, Variable } from "./interfaces";
import { argmin_random_tie, random_choice } from "./utils";

/**
 * Solve a CSP by stochastic hill-climbing on the number of conflicts.
 *
 * @param  {CSP<TAttributes>} aCSP
 * @param  {number=100000} max_steps
 * @returns CurrentDomain<TAttributes> | undefined
 */
export const min_conflicts = <TAttributes extends object>(
  aCSP: CSP<TAttributes>,
  max_steps: number = 100000,
): CurrentDomain<TAttributes> | undefined => {
  // Generate a complete assignment for all variables (probably with conflicts)
  let current: CurrentDomain<TAttributes> = {};
  aCSP.variables.forEach(variable => {
    const val = min_conflicts_value<TAttributes>(aCSP, variable, current);
    aCSP.assign(variable, val, current);
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
  // TODO: update this to return the schedule with conflicts.
  return undefined;
};

/**
 * Return the value that will give var the least number of conflicts.
 * If there is a tie, choose at random.
 *
 * @param  {CSP<TAttributes>} aCSP
 * @param  {Variable} variable
 * @param  {CurrentDomain<TAttributes>} current
 * @returns TAttributes
 */
export const min_conflicts_value = <TAttributes extends object>(
  aCSP: CSP<TAttributes>,
  variable: Variable,
  current: CurrentDomain<TAttributes>,
): TAttributes => {
  const num_conflicts = (val: TAttributes) => aCSP.nconflicts(variable, val, current);
  return argmin_random_tie(aCSP.domains[variable], num_conflicts);
};
