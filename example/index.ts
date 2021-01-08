import { CSP, min_conflicts } from "csps";

// Setup your problem
const variables = ["cs108", "cs112", "cs212", "cs214"];
const possible_attributes = [
  ["mwf800", "nh253", "norman"],
  ["mwf800", "nh253", "vanderlinden"],
  ["mwf800", "nh253", "adams"],
  ["mwf800", "sb382", "norman"],
  ["mwf800", "sb382", "vanderlinden"],
  ["mwf800", "sb382", "adams"],
  ["mwf900", "nh253", "norman"],
  ["mwf900", "nh253", "vanderlinden"],
  ["mwf900", "nh253", "adams"],
  ["mwf900", "sb382", "norman"],
  ["mwf900", "sb382", "vanderlinden"],
  ["mwf900", "sb382", "adams"],
];
const domains = {
  cs108: possible_attributes,
  cs112: possible_attributes,
  cs212: possible_attributes,
  cs214: possible_attributes,
};
const neighbors = {
  cs108: ["cs112", "cs212", "cs214"],
  cs112: ["cs108", "cs212", "cs214"],
  cs212: ["cs108", "cs112", "cs214"],
  cs214: ["cs108", "cs112", "cs212"],
};
const constraints = (
  class1: string,
  c1Attributes: string[],
  class2: string,
  c2Attributes: string[],
): boolean => {
  /*
    Constraints for class scheduling
    c1 and c2 are tuples in the form (time, room, faculty)
    returns true if constraints are met.
    The constraint that there is only one section of class
    is implicit because classes are variables.
  */
  // Return true if same class.
  if (class1 === class2) {
    return true;
  }

  // Check to make sure faculty is not teaching at the same time
  if (c1Attributes[0] === c2Attributes[0] && c1Attributes[2] === c2Attributes[2]) {
    return false;
  }

  // Check to make sure class is not in the same room at the same time
  if (c1Attributes[0] === c2Attributes[0] && c1Attributes[1] === c2Attributes[1]) {
    return false;
  }
  return true;
};

const aCSP = new CSP<string>(variables, domains, neighbors, constraints);

// run min_conflicts on problem
const res = min_conflicts(aCSP);
console.log(res);
