import { capitalize } from "../src/string/capitalize";

describe("capitalize", () => {
  test("capitalizes the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  test("handles an empty string", () => {
    expect(capitalize("")).toBe("");
  });

  test("handles an already capitalized string", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });
});