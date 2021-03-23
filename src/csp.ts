import { CurrentDomain, LooseObject, Variable } from "./interfaces";
import { Problem } from "./search";

/**
 * This class describes finite-domain Constraint Satisfaction Problems.
    A CSP is specified by the following inputs:
        variables   A list of variables; each is atomic (e.g. int or string).
        domains     A dict of {var:[possible_value, ...]} entries.
        neighbors   A dict of {var:[var,...]} that for each variable lists
                    the other variables that participate in constraints.
        constraints A function f(A, a, B, b) that returns true if neighbors
                    A, B satisfy the constraint when they have values A=a, B=b

    In the textbook and in most mathematical definitions, the
    constraints are specified as explicit pairs of allowable values,
    but the formulation here is easier to express and more compact for
    most cases (for example, the n-Queens problem can be represented
    in O(n) space using this notation, instead of O(n^4) for the
    explicit representation). In terms of describing the CSP as a
    problem, that's all there is.

    However, the class also supports data structures and methods that help you
    solve CSPs by calling a search function on the CSP. Methods and slots are
    as follows, where the argument 'a' represents an assignment, which is a
    dict of {var:val} entries:
        assign(var, val, a)     Assign a[var] = val; do other bookkeeping
        unassign(var, a)        Do del a[var], plus other bookkeeping
        nconflicts(var, val, a) Return the number of other variables that
                                conflict with var=val
        curr_domains[var]       Slot: remaining consistent values for var
                                Used by constraint propagation routines.
    The following methods are used only by graph_search and tree_search:
        actions(state)          Return a list of actions
        result(state, action)   Return a successor of state
        goal_test(state)        Return true if all constraints satisfied
    The following are just for debugging purposes:
        nassigns                Slot: tracks the number of assignments made
        display(a)              Print a human-readable representation
 *
 * @export
 * @class CSP
 * @extends {Problem<Variable[]>}
 * @template TAttributes extends object
 */
export class CSP<TAttributes extends object> extends Problem<Variable[]> {
  variables: Variable[];
  domains: LooseObject<TAttributes[]>;
  neighbors: LooseObject<Variable[]>;
  constraints: (c1: Variable, c1Attr: TAttributes, c2: Variable, c2Attr: TAttributes) => boolean;
  curr_domains: CurrentDomain<TAttributes> | undefined;
  nassigns: number;

  /**
   * Creates an instance of CSP. Construct a CSP problem. If variables is empty, it becomes domains.keys().
   *
   * @param {(Variable[] | undefined)} variables
   * @param {LooseObject<TAttributes[]>} domains
   * @param {LooseObject<Variable[]>} neighbors
   * @param {(c1: Variable, c1Attr: TAttributes, c2: Variable, c2Attr: TAttributes) => boolean} constraints
   * @memberof CSP
   */
  constructor(
    variables: Variable[] | undefined,
    domains: LooseObject<TAttributes[]>,
    neighbors: LooseObject<Variable[]>,
    constraints: (c1: Variable, c1Attr: TAttributes, c2: Variable, c2Attr: TAttributes) => boolean,
  ) {
    // const initial: any = [];
    super([]);

    this.variables = variables || Object.keys(domains);
    this.domains = domains;
    this.neighbors = neighbors;
    this.constraints = constraints;
    this.curr_domains = undefined;
    this.nassigns = 0;
  }

  /**
   *  Add {var: val} to assignment; Discard the old value if any.
   *
   * @param  {Variable} variable
   * @param  {TAttributes} val
   * @param  {CurrentDomain<TAttributes>} assignment
   */
  assign = (variable: Variable, val: TAttributes, assignment: CurrentDomain<TAttributes>) => {
    assignment[variable] = val;
    this.nassigns += 1;
  };

  /**
   * Remove {var: val} from assignment.
   * DO NOT call this if you are changing a variable to a new value;
   * just call assign for that.
   *
   * @param {Variable} variable
   * @param {CurrentDomain<TAttributes>} assignment
   * @memberof CSP
   */
  unassign = (variable: Variable, assignment: CurrentDomain<TAttributes>) => {
    if (assignment.hasOwnProperty(variable)) {
      delete assignment[variable];
    }
  };

  /**
   *  Return the number of conflicts var=val has with other variables.
   *
   * @param {Variable} variable
   * @param {TAttributes} val
   * @param {CurrentDomain<TAttributes>} assignment
   * @memberof CSP
   */
  nconflicts = (
    variable: Variable,
    val: TAttributes,
    assignment: CurrentDomain<TAttributes>,
  ): number => {
    /**
     * Subclasses may implement this (conflict function) more efficiently
     *
     * @param {Variable} var2
     * @return {*}  {boolean}
     */
    const conflict = (var2: Variable): boolean => {
      return (
        assignment.hasOwnProperty(var2) && !this.constraints(variable, val, var2, assignment[var2])
      );
    };

    return Object.keys(this.neighbors).filter((v: string) => conflict(v)).length;
  };

  /**
   * Show a human-readable representation of the CSP.
   * Subclasses can print in a prettier way, or display with a GUI
   *
   * @param {CurrentDomain<TAttributes>} assignment
   * @memberof CSP
   */
  display = (assignment: CurrentDomain<TAttributes>) => {
    console.log(assignment);
  };

  /**
   * Return a list of variables in current assignment that are in conflict
   * This is for min_conflicts search.
   *
   * @param {CurrentDomain<TAttributes>>} current
   * @memberof CSP
   */
  conflicted_vars = (current: CurrentDomain<TAttributes>) => {
    return this.variables.filter((variable: Variable) => {
      return this.nconflicts(variable, current[variable], current) > 0;
    });
  };
}
