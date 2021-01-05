import { CSP } from '../src';
import { LooseObject } from '../src/interfaces';
import { constraints, domains, neighbors, variables } from './test_helpers';

// TODO: add a better ESLint Config

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
