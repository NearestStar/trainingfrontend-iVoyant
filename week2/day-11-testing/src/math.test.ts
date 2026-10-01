import { createUser } from "./user";

test("creates a user", () => {
    const result = createUser("Bhaskar", 21);

    expect(result).toEqual({
        name: "Bhaskar",
        age: 21,
    });
});