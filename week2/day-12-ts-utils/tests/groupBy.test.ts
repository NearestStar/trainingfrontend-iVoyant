import { groupBy } from "../src/array/groupBy";

describe("groupBy", () => {
  const products = [
    { name: "Laptop", category: "Electronics" },
    { name: "Phone", category: "Electronics" },
    { name: "Chair", category: "Furniture" }
  ];

  test("groups objects by a property", () => {
    expect(groupBy(products, "category")).toEqual({
      Electronics: [
        { name: "Laptop", category: "Electronics" },
        { name: "Phone", category: "Electronics" }
      ],
      Furniture: [
        { name: "Chair", category: "Furniture" }
      ]
    });
  });

  test("handles an empty array", () => {
    expect(groupBy([], "category")).toEqual({});
  });
});