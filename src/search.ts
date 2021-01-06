/**
 * The abstract class for a formal problem. You should subclass
this and implement the methods actions and result, and possibly
__init__, goal_test, and path_cost. Then you will create instances
of your subclass and solve them with the various search functions.
 *
 * @export
 * @class Problem
 * @template T
 */
export class Problem<T> {
  initial: T | T[];
  goal: T | T[] | undefined;

  /**
   * Creates an instance of Problem.
   * The constructor specifies the initial state, and possibly a goal state,
   * if there is a unique goal. Your subclass' constructor can add other arguments.
   *
   * @param {T} initial
   * @param {(T | undefined)} [goal=undefined]
   * @memberof Problem
   */
  constructor(initial: T, goal: T | undefined = undefined) {
    this.initial = initial;
    this.goal = goal;
  }

  /**
   * Return the actions that can be executed in the given state.
   * The result would typically be a list, but if there are many actions,
   *  consider yielding them one at a time in an iterator,
   *  rather than building them all at once.
   *
   * @param {T} _state
   * @memberof Problem
   */
  action = (_state: T) => {
    throw Error("Not Implemented");
  };

  // TODO: add action type

  /**
   * Return the state that results from executing the given
   *  action in the given state. The action must be one of self.actions(state).
   *
   * @param {T} _state
   * @param {*} _action
   * @memberof Problem
   */
  result = (_state: T, _action: any) => {
    throw Error("Not Implemented");
  };

  /* */

  /**
   * Return True if the state is a goal. The default method compares the state
   *  to self.goal or checks for state in self.goal if it is a list,
   *  as specified in the constructor. Override this method if
   *  checking against a single self.goal is not enough.
   *
   * @param {T} state
   * @memberof Problem
   */
  goal_test = (state: T): boolean => {
    if (typeof this.goal === typeof Array) {
      const goal_array = this.goal as T[];
      return goal_array.includes(state);
    } else {
      return state === this.goal;
    }
  };

  /**
   * Return the cost of a solution path that arrives at state2 from state1 via action,
   *  assuming cost c to get up to state1. If the problem is such that the path doesn't matter,
   *  this function will only look at state2. If the path does matter,
   *  it will consider c and maybe state1 and action.
   *  The default method costs 1 for every step in the path.
   *
   * @param {number} c
   * @param {T} _state1
   * @param {*} _action
   * @param {T} _state2
   * @memberof Problem
   */
  path_cost = (c: number, _state1: T, _action: any, _state2: T): number => {
    return c + 1;
  };

  /**
   * For optimization problems, each state has a value.
   * Hill Climbing and related algorithms try to maximize this value.
   *
   * @param {T} _state
   * @memberof Problem
   */
  value = (_state: T) => {
    throw Error("Not Implemented");
  };
}
