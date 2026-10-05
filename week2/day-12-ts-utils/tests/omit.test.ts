import { omit } from "../src/object/omit";

describe("omit", () => {
  const user = {
    id: 1,
    name: "Bhaskar",
    email: "bhaskar@example.com",
    password: "secret"
  };

  test("removes requested properties", () => {
    expect(omit(user, ["password"])).toEqual({
      id: 1,
      name: "Bhaskar",
      email: "bhaskar@example.com"
    });
  });

  test("removes multiple properties", () => {
    expect(omit(user, ["id", "password"])).toEqual({
      name: "Bhaskar",
      email: "bhaskar@example.com"
    });
  });

  test("handles an empty key list", () => {
    expect(omit(user, [])).toEqual(user);
  });
});