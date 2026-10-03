import {
  calculateInventoryValue,
  calculateTotalValue,
  getLowStockProducts,
  validateProduct,
  addStock,
  sellStock,
  searchProducts,
  Product
} from "./inventory";

const products: Product[] = [
  {
    id: 1,
    name: "Keyboard",
    sku: "KB101",
    price: 1000,
    quantity: 10,
    reorderLevel: 3
  },
  {
    id: 2,
    name: "Mouse",
    sku: "MS101",
    price: 500,
    quantity: 2,
    reorderLevel: 5
  }
];

describe("calculateInventoryValue", () => {
  test("calculates the total inventory value", () => {
    expect(calculateInventoryValue(100, 20)).toBe(2000);
  });

  test("returns zero when quantity is zero", () => {
    expect(calculateInventoryValue(100, 0)).toBe(0);
  });

  test("handles decimal prices", () => {
    expect(calculateInventoryValue(12.5, 4)).toBe(50);
  });
});

describe("calculateTotalValue", () => {
  test("calculates the value of all products", () => {
    expect(calculateTotalValue(products)).toBe(11000);
  });

  test("returns zero for an empty inventory", () => {
    expect(calculateTotalValue([])).toBe(0);
  });
});

describe("getLowStockProducts", () => {
  test("returns products at or below their reorder level", () => {
    expect(getLowStockProducts(products)).toEqual([products[1]]);
  });

  test("returns an empty array when all products have sufficient stock", () => {
    expect(getLowStockProducts([products[0]])).toEqual([]);
  });
});

describe("validateProduct", () => {
  const newProduct = {
    name: "Monitor",
    sku: "MN101",
    price: 8000,
    quantity: 5,
    reorderLevel: 2
  };

  test("accepts valid product details", () => {
    expect(validateProduct(newProduct, products)).toEqual([]);
  });

  test("rejects a duplicate SKU", () => {
    const duplicate = { ...newProduct, sku: "kb101" };

    expect(validateProduct(duplicate, products)).toContain(
      "SKU already exists"
    );
  });

  test("rejects a negative price", () => {
    const invalid = { ...newProduct, price: -100 };

    expect(validateProduct(invalid, products)).toContain(
      "Price must be greater than zero"
    );
  });

  test("rejects a negative quantity", () => {
    const invalid = { ...newProduct, quantity: -1 };

    expect(validateProduct(invalid, products)).toContain(
      "Quantity must be a non-negative integer"
    );
  });
});

describe("addStock", () => {
  test("increases the product quantity", () => {
    expect(addStock(products[0], 5).quantity).toBe(15);
  });

  test("rejects zero stock additions", () => {
    expect(() => addStock(products[0], 0)).toThrow(
      "Stock amount must be a positive integer"
    );
  });

  test("does not modify the original product", () => {
    const updated = addStock(products[0], 5);

    expect(products[0].quantity).toBe(10);
    expect(updated.quantity).toBe(15);
  });
});

describe("sellStock", () => {
  test("reduces the product quantity", () => {
    expect(sellStock(products[0], 4).quantity).toBe(6);
  });

  test("rejects sales exceeding available stock", () => {
    expect(() => sellStock(products[0], 20)).toThrow(
      "Insufficient stock"
    );
  });

  test("rejects negative sale amounts", () => {
    expect(() => sellStock(products[0], -2)).toThrow(
      "Sale amount must be a positive integer"
    );
  });
});

describe("searchProducts", () => {
  test("searches by product name", () => {
    expect(searchProducts(products, "keyboard")).toEqual([products[0]]);
  });

  test("searches by SKU", () => {
    expect(searchProducts(products, "MS101")).toEqual([products[1]]);
  });

  test("returns all products for an empty search", () => {
    expect(searchProducts(products, " ")).toEqual(products);
  });
});