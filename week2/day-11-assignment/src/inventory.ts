export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  reorderLevel: number;
}

export function calculateInventoryValue(
  price: number,
  quantity: number
): number {
  return price * quantity;
}

export function calculateTotalValue(products: Product[]): number {
  return products.reduce(
    (total, product) =>
      total + calculateInventoryValue(product.price, product.quantity),
    0
  );
}

export function getLowStockProducts(products: Product[]): Product[] {
  return products.filter(
    (product) => product.quantity <= product.reorderLevel
  );
}

export function validateProduct(
  product: Omit<Product, "id">,
  products: Product[]
): string[] {
  const errors: string[] = [];

  if (!product.name.trim()) {
    errors.push("Product name is required");
  }

  if (!product.sku.trim()) {
    errors.push("SKU is required");
  }

  if (products.some((item) => item.sku.toLowerCase() === product.sku.toLowerCase())) {
    errors.push("SKU already exists");
  }

  if (!Number.isFinite(product.price) || product.price <= 0) {
    errors.push("Price must be greater than zero");
  }

  if (!Number.isInteger(product.quantity) || product.quantity < 0) {
    errors.push("Quantity must be a non-negative integer");
  }

  if (!Number.isInteger(product.reorderLevel) || product.reorderLevel < 0) {
    errors.push("Reorder level must be a non-negative integer");
  }

  return errors;
}

export function addStock(
  product: Product,
  amount: number
): Product {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Stock amount must be a positive integer");
  }

  return {
    ...product,
    quantity: product.quantity + amount
  };
}

export function sellStock(
  product: Product,
  amount: number
): Product {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Sale amount must be a positive integer");
  }

  if (amount > product.quantity) {
    throw new Error("Insufficient stock");
  }

  return {
    ...product,
    quantity: product.quantity - amount
  };
}

export function searchProducts(
  products: Product[],
  query: string
): Product[] {
  const searchTerm = query.trim().toLowerCase();

  if (!searchTerm) {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
  );
}