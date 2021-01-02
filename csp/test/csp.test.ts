import { CSP } from '../src';
import { LooseObject } from '../src/interfaces';

// TODO: add a better ESLint Config

// https://stackoverflow.com/a/53556607/9931154
// https://stackoverflow.com/a/43053803/9931154
const cartesian = <K, T extends Array<any>>(...a: T): K =>
  a.reduce((a, b) =>
    a.flatMap((d: T) =>
      b.map((e: T) => ([d, e] as Array<any> & { flat(): Array<any> }).flat())
    )
  );

const get_possible_domain_values = (attribute_list: string[][]) => {
  return cartesian<string[], string[][]>(...attribute_list);
};

const get_domains = <T>(variables: string[], possible_domain_values: T) => {
  const domains: LooseObject<T> = {};
  variables.forEach(variable => {
    domains[variable] = possible_domain_values;
  });
  return domains;
};

const get_neighbors = <T extends Array<string>>(variables: T) => {
  const neighbors: LooseObject<T> = {};
  variables.forEach(variable => {
    neighbors[variable] = (variables.filter(neighbor => {
      return neighbor !== variable;
    }) as unknown) as T;
  });
  return neighbors;
};

// TODO: make the attributes type and object and not an array
const constraints = (
  class1: string,
  c1Attributes: string[],
  class2: string,
  c2Attributes: string[]
): boolean => {
  /*
    """Constraints for class scheduling
    c1 and c2 are tuples in the form (time, room, faculty)
    returns true if constraints are met.
    The constraint that there is only one section of class
    is implicit because classes are variables.
    """
  */
  //  # Return true if same class.
  if (class1 === class2) {
    return true;
  }

  //  # check to make sure faculty is not teaching at the same time
  if (
    c1Attributes[0] === c2Attributes[0] &&
    c1Attributes[2] == c2Attributes[2]
  ) {
    return false;
  }

  // # Check to make sure class is not in the same room at the same time
  if (
    c1Attributes[0] == c2Attributes[0] &&
    c1Attributes[1] == c2Attributes[1]
  ) {
    return false;
  }
  return true;
};

// some values for testing
const classes = ['cs108', 'cs112', 'cs212', 'cs214'];
const variables = classes;
const faculty = ['norman', 'vanderlinden', 'adams'];
const times = ['mwf800', 'mwf900'];
const rooms = ['nh253', 'sb382'];
const attribute_list = [times, rooms, faculty];
const possible_domain_values = get_possible_domain_values(attribute_list);
const domains = get_domains(variables, possible_domain_values);
const neighbors = get_neighbors(variables);

describe('csp object instance', () => {
  it('is initialized with four params', () => {
    const csp = new CSP<string>(variables, domains, neighbors, constraints);
    expect(csp.initial).toEqual([]);
    expect(csp.goal).toEqual(undefined);

    expect(csp.variables).toEqual(variables);
    expect(csp.domains).toEqual(domains);
    expect(csp.neighbors).toEqual(neighbors);
    expect(csp.constraints).toEqual(constraints);
    expect(csp.curr_domains).toEqual(undefined);
    expect(csp.nassigns).toEqual(0);
  });

  it('is initialized with three params', () => {
    const csp = new CSP(undefined, domains, neighbors, constraints);

    // Focus on being able to correctly get variables
    expect(csp.variables).toEqual(variables);
    expect(csp.variables).toEqual(Object.keys(domains));

    expect(csp.initial).toEqual([]);
    expect(csp.goal).toEqual(undefined);
    expect(csp.domains).toEqual(domains);
    expect(csp.neighbors).toEqual(neighbors);
    expect(csp.constraints).toEqual(constraints);
    expect(csp.curr_domains).toEqual(undefined);
    expect(csp.nassigns).toEqual(0);
  });

  // const csp = new CSP(undefined, domains, neighbors, constraints);
  // const assignment: LooseObject<string[]> = {};

  // it('correctly uses CSP.assign()', () => {
  //   expect();
  // });

  // it('throws on result()', () => {
  //   expect(() => problem.result(undefined, undefined)).toThrow(
  //     'Not Implemented'
  //   );
  // });

  // it('correctly assesses goals with goal_test()', () => {
  //   expect(problem.goal_test(undefined));

  //   problem.goal = 1;
  //   expect(problem.goal_test(undefined)).not.toEqual(true);
  //   expect(problem.goal_test(1));

  //   problem.goal = [1, 2];
  //   expect(problem.goal_test(undefined)).not.toEqual(true);
  //   expect(problem.goal_test(2));
  // });

  // it('correctly calculates path_cost()', () => {
  //   expect(problem.path_cost(1, undefined, undefined, undefined)).toEqual(2);
  //   expect(problem.path_cost(10, undefined, undefined, undefined)).toEqual(11);
  // });

  // it('throws on value()', () => {
  //   expect(() => problem.value(undefined)).toThrow('Not Implemented');
  // });
});
