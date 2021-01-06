import { LooseObject } from "./interfaces";
import { Problem } from "./search";

// TODO: Will probably need to separate the T generic param into multiple different ones.
// Once the attributes is separated into it's own object type.

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
 * @extends {Problem<T[]>}
 * @template T
 */
export class CSP<T extends string> extends Problem<T[]> {
  variables: T[];
  domains: LooseObject<T[][]>;
  neighbors: LooseObject<T[]>;
  constraints: (c1: T, c1Attr: T[], c2: T, c2Attr: T[]) => boolean;
  curr_domains: LooseObject<T[][]> | undefined;
  nassigns: number;

  /**
   * Creates an instance of CSP. Construct a CSP problem. If variables is empty, it becomes domains.keys().
   *
   * @param {(T[] | undefined)} variables
   * @param {LooseObject<T[][]>} domains
   * @param {LooseObject<T[]>} neighbors
   * @param {(c1: T, c1Attr: T[], c2: T, c2Attr: T[]) => boolean} constraints
   * @memberof CSP
   */
  constructor(
    variables: T[] | undefined,
    domains: LooseObject<T[][]>,
    neighbors: LooseObject<T[]>,
    constraints: (c1: T, c1Attr: T[], c2: T, c2Attr: T[]) => boolean,
  ) {
    // const initial: any = [];
    super([]);

    this.variables = variables || (Object.keys(domains) as T[]);
    this.domains = domains;
    this.neighbors = neighbors;
    this.constraints = constraints;
    this.curr_domains = undefined;
    this.nassigns = 0;
  }

  /* Add {var: val} to assignment; Discard the old value if any.*/
  assign = (variable: T, val: T[], assignment: LooseObject<T[]>) => {
    assignment[variable] = val;
    this.nassigns += 1;
  };

  /**
   * Remove {var: val} from assignment.
   * DO NOT call this if you are changing a variable to a new value;
   * just call assign for that.
   *
   * @param {T} variable
   * @param {LooseObject<T[]>} assignment
   * @memberof CSP
   */
  unassign = (variable: T, assignment: LooseObject<T[]>) => {
    if (assignment.hasOwnProperty(variable)) {
      delete assignment[variable];
    }
  };

  /**
   *  Return the number of conflicts var=val has with other variables.
   *
   * @param {T} variable
   * @param {T[]} val
   * @param {LooseObject<T[]>} assignment
   * @memberof CSP
   */
  nconflicts = (variable: T, val: T[], assignment: LooseObject<T[]>): number => {
    /**
     * Subclasses may implement this (conflict function) more efficiently
     *
     * @param {T} var2
     * @return {*}  {boolean}
     */
    const conflict = (var2: T): boolean => {
      return (
        assignment.hasOwnProperty(var2) && !this.constraints(variable, val, var2, assignment[var2])
      );
    };

    return Object.keys(this.neighbors).filter((v: string) => conflict(v as T)).length;
  };

  /**
   * Show a human-readable representation of the CSP.
   * Subclasses can print in a prettier way, or display with a GUI
   *
   * @param {LooseObject<T[]>} assignment
   * @memberof CSP
   */
  display = (assignment: LooseObject<T[]>) => {
    console.log(assignment);
  };

  /**
   * Return a list of variables in current assignment that are in conflict
   * This is for min_conflicts search.
   *
   * @param {LooseObject<T[]>} current
   * @memberof CSP
   */
  conflicted_vars = (current: LooseObject<T[]>) => {
    return this.variables.filter((variable: T) => {
      return this.nconflicts(variable, current[variable], current) > 0;
    });
  };
}
