import { sum } from "../src/number/sum";
import { clamp } from "../src/number/clamp";

describe("sum", () => {
  test("adds numbers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  test("handles an empty array", () => {
    expect(sum([])).toBe(0);
  });

  test("handles negative numbers", () => {
    expect(sum([-5, 10, -2])).toBe(3);
  });
});

describe("clamp", () => {
  test("returns minimum when value is too low", () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  test("returns maximum when value is too high", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  test("returns value when it is within range", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  test("throws when min is greater than max", () => {
    expect(() => clamp(50, 100, 0)).toThrow(
      "Minimum value cannot be greater than maximum value"
    );
  });
});