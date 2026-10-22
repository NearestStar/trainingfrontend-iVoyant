import { useState, type FormEvent } from "react";
import type { Product, ProductDraft } from "../services/productsApi";

interface ProductFormProps {
  initialProduct?: Product;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (draft: ProductDraft) => Promise<void>;
}

const emptyDraft: ProductDraft = {
  title: "",
  description: "",
  price: 49.99,
  category: "Accessories",
  thumbnail:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
  stock: 10,
  rating: 4.5,
};

export default function ProductForm({
  initialProduct,
  isSaving,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductDraft>(() =>
    initialProduct
      ? {
          title: initialProduct.title,
          description: initialProduct.description,
          price: initialProduct.price,
          category: initialProduct.category,
          thumbnail: initialProduct.thumbnail,
          stock: initialProduct.stock,
          rating: initialProduct.rating,
        }
      : emptyDraft,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="product-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">CATALOG MANAGEMENT</p>
            <h2 id="product-form-title">
              {initialProduct ? "Edit product" : "Add a product"}
            </h2>
            <p className="muted-copy">
              {initialProduct
                ? "Update the details and save your changes."
                : "Add a new item to your local product catalog."}
            </p>
          </div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Close form">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <label className="form-field full-width">
            <span>Product name</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="e.g. Studio headphones"
              maxLength={80}
            />
          </label>

          <label className="form-field full-width">
            <span>Description</span>
            <textarea
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="What makes this product useful?"
              rows={3}
              maxLength={220}
            />
          </label>

          <label className="form-field">
            <span>Price ($)</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
            />
          </label>

          <label className="form-field">
            <span>Category</span>
            <input
              required
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              placeholder="Accessories"
            />
          </label>

          <label className="form-field">
            <span>Stock quantity</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
            />
          </label>

          <label className="form-field">
            <span>Rating (0–5)</span>
            <input
              required
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
            />
          </label>

          <label className="form-field full-width">
            <span>Image URL</span>
            <input
              required
              type="url"
              value={form.thumbnail}
              onChange={(event) => setForm({ ...form, thumbnail: event.target.value })}
              placeholder="https://example.com/product.jpg"
            />
          </label>

          <div className="form-actions full-width">
            <button className="button-secondary" type="button" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button className="button-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : initialProduct ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
