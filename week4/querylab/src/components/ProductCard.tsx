import type { Product } from "../services/productsApi";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isDeleting: boolean;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  isDeleting,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.thumbnail || fallbackImage}
          alt={product.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        <span className="category-pill">{product.category}</span>
        <span className="rating-pill">★ {Number(product.rating).toFixed(1)}</span>
      </div>

      <div className="product-card-content">
        <div className="product-heading-row">
          <h3>{product.title}</h3>
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
        </div>
        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <span>
            <span className={product.stock <= 8 ? "stock-dot low" : "stock-dot"} />
            {product.stock} in stock
          </span>
          <span className="product-id">ID {product.id}</span>
        </div>

        <div className="product-actions">
          <button className="button-secondary button-small" onClick={() => onEdit(product)}>
            Edit details
          </button>
          <button
            className="button-danger button-small"
            onClick={() => onDelete(product)}
            disabled={isDeleting}
            aria-label={`Delete ${product.title}`}
          >
            {isDeleting ? "Removing…" : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
