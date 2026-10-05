import { unique } from "../src/array/unique";

describe("unique", () => {
  test("removes duplicate numbers", () => {
    expect(unique([1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  test("removes duplicate strings", () => {
    expect(unique(["apple", "banana", "apple"])).toEqual([
      "apple",
      "banana"
    ]);
  });

  test("handles an empty array", () => {
    expect(unique([])).toEqual([]);
  });
});