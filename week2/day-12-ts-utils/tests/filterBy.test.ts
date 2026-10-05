import { filterBy } from "../src/array/filterBy";

describe("filterBy", () => {
  const products = [
    { name: "Laptop", price: 50000 },
    { name: "Mouse", price: 1000 },
    { name: "Keyboard", price: 3000 }
  ];

  test("filters items using a predicate", () => {
    expect(
      filterBy(products, product => product.price > 3000)
    ).toEqual([
      { name: "Laptop", price: 50000 }
    ]);
  });

  test("returns matching multiple items", () => {
    expect(
      filterBy(products, product => product.price >= 3000)
    ).toEqual([
      { name: "Laptop", price: 50000 },
      { name: "Keyboard", price: 3000 }
    ]);
  });

  test("returns an empty array when nothing matches", () => {
    expect(
      filterBy(products, product => product.price > 100000)
    ).toEqual([]);
  });
});