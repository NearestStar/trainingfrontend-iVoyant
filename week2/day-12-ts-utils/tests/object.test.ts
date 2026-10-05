import { pick } from "../src/object/pick";

describe("pick", () => {
  const user = {
    id: 1,
    name: "Bhaskar",
    email: "bhaskar@example.com",
    age: 22
  };

  test("selects requested properties", () => {
    expect(pick(user, ["name", "email"])).toEqual({
      name: "Bhaskar",
      email: "bhaskar@example.com"
    });
  });

  test("selects a single property", () => {
    expect(pick(user, ["id"])).toEqual({
      id: 1
    });
  });

  test("handles an empty key list", () => {
    expect(pick(user, [])).toEqual({});
  });
});