import seedrandom from 'seedrandom';
import {
  argmin_random_tie,
  CSP,
  identity,
  min_conflicts,
  min_conflicts_value,
  random_choice,
  shuffle_array,
} from '../src';
import { constraints, domains, neighbors, variables } from './test_helpers';
// NOTE: changing the LOC in this file breaks tests with random.
seedrandom('seed', { global: true });

describe('min_conflicts functions', () => {
  it('correctly implements identity()', () => {
    expect(identity(1)).toEqual(1);
    expect(identity([2, 3])).toEqual([2, 3]);
  });

  it('correctly implements shuffle_array()', () => {
    expect(shuffle_array([1, 2, 3, 4])).toEqual([2, 3, 4, 1]);
  });

  it('correctly implements random_choice()', () => {
    expect(random_choice([1, 2, 3, 4])).toEqual(2);
  });

  it('correctly implements argmin_random_tie()', () => {
    expect(argmin_random_tie([1, 2, 3, 4])).toEqual(1);
    expect(argmin_random_tie([10, 20, -1, 4])).toEqual(-1);
  });

  // # Generate the CSP values.
  const aCSP = new CSP<string>(variables, domains, neighbors, constraints);

  // # set up assignments for classes.
  const assignment = {};
  const [first_class, second_class, third_class, fourth_class] = variables;

  // # Note: for the testing, the domains are the same for every class.
  const [first_domain_attrs, second_domain_attrs] = domains[first_class];
  aCSP.assign(first_class, first_domain_attrs, assignment);
  aCSP.assign(second_class, second_domain_attrs, assignment);
  aCSP.assign(third_class, second_domain_attrs, assignment);

  it('correctly implements min_conflicts_value()', () => {
    const res = ['mwf900', 'nh253', 'adams'];
    expect(min_conflicts_value(aCSP, fourth_class, assignment)).toEqual(res);
    aCSP.assign(fourth_class, res, assignment);
    expect(assignment).toEqual({
      cs108: ['mwf800', 'nh253', 'norman'],
      cs112: ['mwf800', 'nh253', 'vanderlinden'],
      cs212: ['mwf800', 'nh253', 'vanderlinden'],
      cs214: res,
    });
  });

  it('correctly implements min_conflicts()', () => {
    expect(min_conflicts(aCSP)).toEqual({
      cs108: ['mwf800', 'nh253', 'adams'],
      cs112: ['mwf900', 'nh253', 'adams'],
      cs212: ['mwf900', 'sb382', 'vanderlinden'],
      cs214: ['mwf800', 'sb382', 'norman'],
    });
  });
});
