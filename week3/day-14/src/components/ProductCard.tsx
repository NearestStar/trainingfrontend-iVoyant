import Card from "./Card";
import Button from "./Button";

type ProductCardProps = {
  image: string;
  category: string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  rating: string;
  badge?: string;
};

function ProductCard({
  image,
  category,
  name,
  description,
  price,
  oldPrice,
  rating,
  badge,
}: ProductCardProps) {
  return (
    <Card className="product-card">
      <div className="product-image-wrapper">
        {badge && (
          <span className="product-badge">
            {badge}
          </span>
        )}

        <img
          src={image}
          alt={name}
          className="product-image"
        />
      </div>

      <div className="product-content">
        <span className="product-category">
          {category}
        </span>

        <div className="product-title-row">
          <h3>{name}</h3>

          <span className="rating">
            ★ {rating}
          </span>
        </div>

        <p className="product-description">
          {description}
        </p>

        <div className="product-bottom">
          <div className="price">
            <strong>{price}</strong>

            {oldPrice && (
              <span>{oldPrice}</span>
            )}
          </div>

          <Button text="View Product" />
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;