import { LooseObject } from "../src/interfaces";

// https://stackoverflow.com/a/39838385/9931154
const flatMap = (f: Function, xs: any[]) => xs.reduce((acc: any, x: any) => acc.concat(f(x)), []);

// https://stackoverflow.com/a/43053803/9931154
const cartesian = <K, T extends Array<any>>(...a: T): K =>
  a.reduce((a, b) =>
    flatMap((d: T) => b.map((e: T) => ([d, e] as Array<any> & { flat(): Array<any> }).flat()), a),
  );

const get_possible_domain_values = (attribute_list: string[][]): string[][] => {
  return cartesian<string[][], string[][]>(...attribute_list);
};

const get_domains = <T extends Array<string>>(variables: T, possible_domain_values: T[]) => {
  const domains: LooseObject<T[]> = {};
  variables.forEach((variable: string) => {
    domains[variable] = possible_domain_values as T[];
  });
  return domains;
};

const get_neighbors = <T extends Array<string>>(variables: T) => {
  const neighbors: LooseObject<T> = {};
  variables.forEach((variable: string) => {
    neighbors[variable] = variables.filter((neighbor: string) => {
      return neighbor !== variable;
    }) as T;
  });
  return neighbors;
};

// TODO: make the attributes type and object and not an array
export const constraints = (
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

// some values for testing
const classes = ["cs108", "cs112", "cs212", "cs214"];
export const variables = classes;
const faculty = ["norman", "vanderlinden", "adams"];
const times = ["mwf800", "mwf900"];
const rooms = ["nh253", "sb382"];
const attribute_list = [times, rooms, faculty];
const possible_domain_values = get_possible_domain_values(attribute_list);
export const domains = get_domains(variables, possible_domain_values);
export const neighbors = get_neighbors(variables);
