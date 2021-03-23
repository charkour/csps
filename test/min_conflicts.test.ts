import seedrandom from "seedrandom";
import { CSP, min_conflicts, min_conflicts_value } from "../src";
import { argmin_random_tie, identity, random_choice, shuffle_array } from "../src/utils";
import { ClassAttributes, constraints, domains, neighbors, variables } from "./test_helpers";
// NOTE: changing the LOC in this file breaks tests with random.
seedrandom("seed", { global: true });

describe("min_conflicts functions", () => {
  it("correctly implements identity()", () => {
    expect(identity(1)).toEqual(1);
    expect(identity([2, 3])).toEqual([2, 3]);
  });

  it("correctly implements shuffle_array()", () => {
    expect(shuffle_array([1, 2, 3, 4])).toEqual([4, 3, 2, 1]);
  });

  it("correctly implements random_choice()", () => {
    expect(random_choice([1, 2, 3, 4])).toEqual(4);
  });

  it("correctly implements argmin_random_tie() using identity function", () => {
    expect(argmin_random_tie([1, 2, 3, 4])).toEqual(1);
    expect(argmin_random_tie([10, 20, -1, 4])).toEqual(-1);
  });

  // Generate the CSP values.
  const aCSP = new CSP<ClassAttributes>(variables, domains, neighbors, constraints);

  // set up assignments for classes.
  const assignment = {};
  const [first_class, second_class, third_class, fourth_class] = variables;

  // Note: for the testing, the domains are the same for every class.
  const [first_domain_attrs, second_domain_attrs] = domains[first_class];
  aCSP.assign(first_class, first_domain_attrs, assignment);
  aCSP.assign(second_class, second_domain_attrs, assignment);
  aCSP.assign(third_class, second_domain_attrs, assignment);

  it("correctly implements min_conflicts_value()", () => {
    const res: ClassAttributes = { time: "mwf900", room: "sb382", faculty: "norman" };
    expect(min_conflicts_value(aCSP, fourth_class, assignment)).toEqual(res);
    aCSP.assign(fourth_class, res, assignment);
    expect(assignment).toEqual({
      cs108: { time: "mwf800", room: "nh253", faculty: "norman" },
      cs112: { time: "mwf800", room: "nh253", faculty: "vanderlinden" },
      cs212: { time: "mwf800", room: "nh253", faculty: "vanderlinden" },
      cs214: res,
    });
  });

  it("correctly implements min_conflicts()", () => {
    expect(min_conflicts(aCSP)).toEqual({
      cs108: { time: "mwf900", room: "nh253", faculty: "adams" },
      cs112: { time: "mwf900", room: "sb382", faculty: "vanderlinden" },
      cs212: { time: "mwf800", room: "sb382", faculty: "vanderlinden" },
      cs214: { time: "mwf800", room: "nh253", faculty: "adams" },
    });
  });
});
