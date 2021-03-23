import { LooseObject, Variable } from "../src/interfaces";

// https://stackoverflow.com/a/39838385/9931154
const flatMap = (f: Function, xs: any[]) => xs.reduce((acc: any, x: any) => acc.concat(f(x)), []);

/// https://stackoverflow.com/a/60677733/9931154
const flat = (arr: any[]) => {
  return [].concat.apply([], arr);
};

// https://stackoverflow.com/a/43053803/9931154
const cartesian = <K, T extends Array<any>>(...a: T): K =>
  a.reduce((a, b) => flatMap((d: T) => b.map((e: T) => flat([d, e])), a));

const get_possible_domain_values = (attribute_list: string[][]): ClassAttributes[] => {
  const product = cartesian<string[][], string[][]>(...attribute_list);
  const possible_domains: ClassAttributes[] = [];
  product.forEach((item: string[]) => {
    possible_domains.push({
      faculty: item[2],
      room: item[1],
      time: item[0],
    });
  });
  return possible_domains;
};

const get_domains = <K>(variables: Variable[], possible_domain_values: K[]) => {
  const domains: LooseObject<K[]> = {};
  variables.forEach(variable => {
    domains[variable] = possible_domain_values;
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

export const constraints = (
  class1: string,
  c1Attributes: ClassAttributes,
  class2: string,
  c2Attributes: ClassAttributes,
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
  if (c1Attributes.time === c2Attributes.time && c1Attributes.faculty === c2Attributes.faculty) {
    return false;
  }

  // Check to make sure class is not in the same room at the same time
  if (c1Attributes.time === c2Attributes.time && c1Attributes.room === c2Attributes.room) {
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
const possible_domain_values: ClassAttributes[] = get_possible_domain_values(attribute_list);
export const domains: LooseObject<ClassAttributes[]> = get_domains(
  variables,
  possible_domain_values,
);
export const neighbors = get_neighbors(variables);

export interface ClassAttributes {
  faculty: string;
  room: string;
  time: string;
}
