// Only use while writing test. Comment out import when actually testing.
// import 'jest';

import { sum } from "../src";

describe("blah", () => {
  it("works", () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
