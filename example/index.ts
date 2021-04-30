import { CSP, CurrentDomain, min_conflicts } from "csps";

// Define your variable's object attribute structure
interface ClassAttributes {
  faculty: string;
  room: string;
  time: string;
}

// Setup your problem
const variables: string[] = ["cs108", "cs112", "cs212", "cs214"];
const possible_attributes: ClassAttributes[] = [
  { time: "mwf800", room: "nh253", faculty: "norman" },
  { time: "mwf800", room: "nh253", faculty: "vanderlinden" },
  { time: "mwf800", room: "nh253", faculty: "adams" },
  { time: "mwf800", room: "sb382", faculty: "norman" },
  { time: "mwf800", room: "sb382", faculty: "vanderlinden" },
  { time: "mwf800", room: "sb382", faculty: "adams" },
  { time: "mwf900", room: "nh253", faculty: "norman" },
  { time: "mwf900", room: "nh253", faculty: "vanderlinden" },
  { time: "mwf900", room: "nh253", faculty: "adams" },
  { time: "mwf900", room: "sb382", faculty: "norman" },
  { time: "mwf900", room: "sb382", faculty: "vanderlinden" },
  { time: "mwf900", room: "sb382", faculty: "adams" },
];
const domains: { [key: string]: ClassAttributes[] } = {
  cs108: possible_attributes,
  cs112: possible_attributes,
  cs212: possible_attributes,
  cs214: possible_attributes,
};
const neighbors: { [key: string]: string[] } = {
  cs108: ["cs112", "cs212", "cs214"],
  cs112: ["cs108", "cs212", "cs214"],
  cs212: ["cs108", "cs112", "cs214"],
  cs214: ["cs108", "cs112", "cs212"],
};
const constraints = (
  class1: string,
  c1Attributes: ClassAttributes,
  class2: string,
  c2Attributes: ClassAttributes,
): boolean => {
  /*
    Constraints for class scheduling
    c1 and c2 are objects in the form {time, room, faculty}
    returns true if constraints are met.
    The constraint that there is only one section of class
    is implicit because classes are variables.
  */
  // Return true if same class.
  if (class1 === class2) {
    return true;
  }

  // Check to make sure faculty is not teaching at the same time
  if (c1Attributes.time === c2Attributes.time && c1Attributes.faculty === c2Attributes.faculty) {
    return false;
  }

  // Check to make sure class is not in the same room at the same time
  if (c1Attributes.time === c2Attributes.time && c1Attributes.room === c2Attributes.room) {
    return false;
  }
  return true;
};

const aCSP: CSP<ClassAttributes> = new CSP<ClassAttributes>(
  variables,
  domains,
  neighbors,
  constraints,
);

// run min_conflicts on problem
const res: CurrentDomain<ClassAttributes> = min_conflicts(aCSP);
console.log(res);
// {
//   cs108: { time: 'mwf800', room: 'sb382', faculty: 'norman' },
//   cs112: { time: 'mwf900', room: 'sb382', faculty: 'adams' },
//   cs212: { time: 'mwf900', room: 'nh253', faculty: 'norman' },
//   cs214: { time: 'mwf800', room: 'nh253', faculty: 'adams' }
// } // or something similar.
