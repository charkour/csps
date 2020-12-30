// # Min-conflicts hill-climbing search for CSPs


//     """Solve a CSP by stochastic hillclimbing on the number of conflicts."""
const min_conflicts = (csp: CSP, max_steps: number = 100000 ) => {
  // # Generate a complete assignment for all variables (probably with conflicts)
  let current = {};
  for (const variable in csp.variables) {
    const val = min_conflicts_value(csp, variable, current);
    csp.assign(variable, val, current);
  }

  // # Now repeatedly choose a random conflicted variable and change it
  for (let i = 0; i < max_steps; i++) {
    const conflicted = csp.conflicted_vars(current);
    if (!conflicted) {
      return current;
    }
    // Ref: https://stackoverflow.com/a/4550514/9931154
    const variable = conflicted[Math.floor(Math.random() * conflicted.length)];
    const val = min_conflicts_value(csp, variable, current);
    csp.assign(variable, val, current);
  }
  return undefined;
}


// def min_conflicts_value(csp, var, current):
//     """Return the value that will give var the least number of conflicts.
//     If there is a tie, choose at random."""
//     return argmin_random_tie(csp.domains[var],
//                              key=lambda val: csp.nconflicts(var, val, current))
const min_conflicts_value = (csp: CSP, variable: any, current: object) => {

}