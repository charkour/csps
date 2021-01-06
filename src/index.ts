export * from "./csp";
export * from "./min_conflicts";
export * from "./search";

export const sum = (a: number, b: number) => {
  if ("development" === process.env.NODE_ENV) {
    console.log("boop");
  }
  return a + b;
};
