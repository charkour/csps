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

const get_possible_domain_values = (attribute_list: string[][]): string[][] => {
  return cartesian<string[][], string[][]>(...attribute_list);
};

const get_domains = <T extends Array<string>>(
  variables: T,
  possible_domain_values: T[]
) => {
  const domains: LooseObject<T[]> = {};
  variables.forEach((variable: string) => {
    domains[variable] = possible_domain_values as T[];
  });
  return domains;
};

const get_neighbors = <T extends Array<string>>(variables: T) => {
  const neighbors: LooseObject<T> = {};
  variables.forEach(variable => {
    neighbors[variable] = variables.filter(neighbor => {
      return neighbor !== variable;
    }) as T;
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
    c1Attributes[2] === c2Attributes[2]
  ) {
    return false;
  }

  // # Check to make sure class is not in the same room at the same time
  if (
    c1Attributes[0] === c2Attributes[0] &&
    c1Attributes[1] === c2Attributes[1]
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

  let csp = new CSP(undefined, domains, neighbors, constraints);
  let assignment: LooseObject<string[]> = {};
  const first_class = variables[0];
  // # Note: all of the domain values are the same for every variable in this example
  const first_valid_attributes = domains[first_class][0];
  const second_valid_assignments = domains[first_class][1];
  const tmp_assignment: LooseObject<string[]> = {};

  it('correctly uses CSP.assign() to assign', () => {
    csp.assign(first_class, first_valid_attributes, assignment);
    tmp_assignment[first_class] = first_valid_attributes;
    expect(assignment).toEqual(tmp_assignment);
    expect(csp.nassigns).toEqual(1);
  });

  it('correctly uses CSP.assign() to reassign', () => {
    csp.assign(first_class, second_valid_assignments, assignment);
    tmp_assignment[first_class] = second_valid_assignments;
    // # TODO: should this be 1? Can update my class logic.
    expect(assignment).toEqual(tmp_assignment);
    expect(csp.nassigns).toEqual(2);
  });

  const [second_class, third_class] = variables.slice(1, 3);

  it('correctly uses CSP.unassign()', () => {
    expect(csp.nassigns).toEqual(2);
    csp.unassign(first_class, assignment);
    expect(assignment).toEqual({});
    // # assert aCSP.nassigns == 0 # TODO: Should this be 0 instead of 2?
    expect(csp.nassigns).toEqual(2);

    // remove a class that isn't in the schedule
    csp.assign(third_class, first_valid_attributes, assignment);
    csp.unassign(second_class, assignment);
    const tmp_assignment: LooseObject<string[]> = {};
    tmp_assignment[third_class] = first_valid_attributes;
    expect(assignment).toEqual(tmp_assignment);
    expect(csp.nassigns).toEqual(3);

    csp.unassign(third_class, assignment);
    expect(assignment).toEqual({});
    // # TODO: should this be 0?
    expect(csp.nassigns).toEqual(3);
  });

  assignment = {};
  csp = new CSP(undefined, domains, neighbors, constraints);
  const sixth_valid_attributes = domains[first_class][5];
  it('correctly implements nconflicts()', () => {
    // test with no assignments
    expect(
      csp.nconflicts(first_class, first_valid_attributes, assignment)
    ).toEqual(0);

    // test with two conflicting assignment values (time and room)
    csp.assign(first_class, first_valid_attributes, assignment);
    csp.assign(second_class, second_valid_assignments, assignment);
    expect(
      csp.nconflicts(first_class, first_valid_attributes, assignment)
    ).toEqual(1);

    // assign to exactly the same attribute set as first_class
    csp.assign(second_class, first_valid_attributes, assignment);
    expect(
      csp.nconflicts(first_class, first_valid_attributes, assignment)
    ).toEqual(1);

    // test with two non-conflicting assignments
    csp.assign(second_class, sixth_valid_attributes, assignment);
    expect(
      csp.nconflicts(first_class, first_valid_attributes, assignment)
    ).toEqual(0);
    expect(
      csp.nconflicts(second_class, sixth_valid_attributes, assignment)
    ).toEqual(0);
  });

  it('displays correctly', () => {
    // Yeah, this is kinda a dumb test.
    expect(csp.display(assignment)).toEqual(console.log(assignment));
  });

  it('correctly implements conflicted_vars()', () => {
    assignment = {};
    variables.forEach(variable => {
      assignment[variable] = first_valid_attributes;
    });
    expect(csp.conflicted_vars(assignment)).toEqual(variables);
    expect(csp.conflicted_vars(assignment).length).toEqual(4);
    // # change one of the conflicts
    assignment[first_class] = sixth_valid_attributes;
    const variables_copy = [...variables];
    var index = variables.indexOf(first_class);
    // https://stackoverflow.com/a/3954451/9931154
    if (index !== -1) {
      variables_copy.splice(index, 1);
    }
    expect(csp.conflicted_vars(assignment)).toEqual(variables_copy);
    expect(csp.conflicted_vars(assignment).length).toEqual(3);

    // # change back to conflict
    assignment[first_class] = second_valid_assignments;
    expect(csp.conflicted_vars(assignment)).toEqual(variables);
    expect(csp.conflicted_vars(assignment).length).toEqual(4);
  });
});
