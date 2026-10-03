
import {
  Product,
  calculateTotalValue,
  getLowStockProducts,
  validateProduct,
  addStock,
  sellStock,
  searchProducts
} from "./inventory";

import "./style.css";

interface Movement {
  id: number;
  productName: string;
  type: "Stock added" | "Sale";
  quantity: number;
  date: string;
}

const STORAGE_KEY = "stockmate-products";
const MOVEMENT_KEY = "stockmate-movements";

let products: Product[] = loadData(STORAGE_KEY, []);
let movements: Movement[] = loadData(MOVEMENT_KEY, []);
let nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;

function loadData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(movements));
}

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" was not found`);
  }
  return element as T;
}

const totalProducts = getElement("total-products");
const inventoryValue = getElement("inventory-value");
const lowStockCount = getElement("low-stock-count");
const productTableBody = getElement<HTMLTableSectionElement>("product-table-body");
const emptyMessage = getElement("empty-message");
const lowStockList = getElement("low-stock-list");
const activityList = getElement("activity-list");
const searchInput = getElement<HTMLInputElement>("search-input");
const productDialog = getElement<HTMLDialogElement>("product-dialog");
const productForm = getElement<HTMLFormElement>("product-form");
const formError = getElement("form-error");

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

function renderSummary(): void {
  totalProducts.textContent = String(products.length);
  inventoryValue.textContent = formatCurrency(calculateTotalValue(products));
  lowStockCount.textContent = String(getLowStockProducts(products).length);
}

function renderProducts(query = ""): void {
  const filteredProducts = searchProducts(products, query);

  productTableBody.innerHTML = "";

  filteredProducts.forEach((product) => {
    const row = document.createElement("tr");
    const isLowStock = product.quantity <= product.reorderLevel;

    row.innerHTML = `
      <td>
        <div class="product-name">${escapeHTML(product.name)}</div>
      </td>
      <td>${escapeHTML(product.sku)}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>${product.quantity}</td>
      <td>
        <span class="stock-badge ${isLowStock ? "low" : "healthy"}">
          ${isLowStock ? "Low stock" : "In stock"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="small-btn" data-action="add" data-id="${product.id}">
            + Stock
          </button>
          <button class="small-btn sale-btn" data-action="sell" data-id="${product.id}">
            Sell
          </button>
        </div>
      </td>
    `;

    productTableBody.appendChild(row);
  });

  emptyMessage.hidden = filteredProducts.length > 0;
}

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function renderLowStock(): void {
  const lowStockProducts = getLowStockProducts(products);
  lowStockList.innerHTML = "";

  if (lowStockProducts.length === 0) {
    lowStockList.textContent = "All products have sufficient stock.";
    return;
  }

  lowStockProducts.forEach((product) => {
    const item = document.createElement("div");
    item.className = "alert-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHTML(product.name)}</strong>
        <span>${product.quantity} units remaining</span>
      </div>
      <span class="alert-level">Restock</span>
    `;

    lowStockList.appendChild(item);
  });
}

function renderActivity(): void {
  activityList.innerHTML = "";

  if (movements.length === 0) {
    activityList.textContent = "No stock activity yet.";
    return;
  }

  movements.slice(0, 6).forEach((movement) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    item.innerHTML = `
      <div class="activity-icon ${movement.type === "Sale" ? "sale" : ""}">
        ${movement.type === "Sale" ? "−" : "+"}
      </div>
      <div class="activity-details">
        <strong>${escapeHTML(movement.productName)}</strong>
        <span>${movement.type} · ${movement.quantity} units</span>
      </div>
      <time>${escapeHTML(movement.date)}</time>
    `;

    activityList.appendChild(item);
  });
}

function renderDashboard(): void {
  renderSummary();
  renderProducts(searchInput.value);
  renderLowStock();
  renderActivity();
}

function recordMovement(
  product: Product,
  type: Movement["type"],
  quantity: number
): void {
  movements.unshift({
    id: Date.now(),
    productName: product.name,
    type,
    quantity,
    date: new Date().toLocaleDateString("en-IN")
  });

  movements = movements.slice(0, 30);
}

function handleProductSubmit(event: SubmitEvent): void {
  event.preventDefault();
  formError.textContent = "";

  const formData = new FormData(productForm);

  const newProduct = {
    name: String(formData.get("name") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    price: Number(formData.get("price")),
    quantity: Number(formData.get("quantity")),
    reorderLevel: Number(formData.get("reorderLevel"))
  };

  const errors = validateProduct(newProduct, products);

  if (errors.length > 0) {
    formError.textContent = errors.join(". ");
    return;
  }

  const product: Product = {
    id: nextId++,
    ...newProduct
  };

  products.push(product);

  if (product.quantity > 0) {
    recordMovement(product, "Stock added", product.quantity);
  }

  saveData();
  productForm.reset();
  productDialog.close();
  renderDashboard();
}

function handleStockAction(
  action: string,
  productId: number
): void {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const amountText = window.prompt(
    action === "add"
      ? `How many units should be added to ${product.name}?`
      : `How many units of ${product.name} were sold?`
  );

  if (amountText === null || amountText.trim() === "") return;

  const amount = Number(amountText);

  try {
    const updatedProduct =
      action === "add"
        ? addStock(product, amount)
        : sellStock(product, amount);

    products = products.map((item) =>
      item.id === productId ? updatedProduct : item
    );

    recordMovement(
      updatedProduct,
      action === "add" ? "Stock added" : "Sale",
      amount
    );

    saveData();
    renderDashboard();
  } catch (error) {
    window.alert(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
}

getElement("add-product-btn").addEventListener("click", () => {
  formError.textContent = "";
  productDialog.showModal();
});

getElement("close-dialog").addEventListener("click", () => {
  productDialog.close();
});

productForm.addEventListener("submit", handleProductSubmit);

searchInput.addEventListener("input", () => {
  renderProducts(searchInput.value);
});

productTableBody.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const productId = Number(button.dataset.id);

  if (action && Number.isInteger(productId)) {
    handleStockAction(action, productId);
  }
});

renderDashboard();