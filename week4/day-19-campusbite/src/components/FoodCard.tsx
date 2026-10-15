import { Heart, Leaf, Plus, Star, Timer } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import type { FoodItem } from "../features/menu/menuData";

interface FoodCardProps {
  item: FoodItem;
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function FoodCard({ item }: FoodCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(item.id));
  const quantity = useAppSelector((state) =>
    state.cart.items.find((cartItem) => cartItem.foodId === item.id)?.quantity ?? 0,
  );

  return (
    <article className="food-card">
      <div className="food-image-wrap">
        <img src={item.image} alt={item.name} className="food-image" loading="lazy" />
        <div className="image-top-labels">
          {item.popular && <span className="popular-pill">Popular</span>}
          {item.isVegetarian && <span className="veg-indicator" title="Vegetarian"><Leaf size={13} /></span>}
        </div>
        <button
          type="button"
          className={`heart-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => dispatch(toggleFavorite(item.id))}
          aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="food-card-body">
        <div className="food-title-row">
          <h3>{item.name}</h3>
          <span className="rating"><Star size={13} fill="currentColor" /> {item.rating.toFixed(1)}</span>
        </div>
        <p className="food-description">{item.description}</p>
        <div className="food-meta"><span><Timer size={14} /> {item.prepTime}</span><span>{item.category}</span></div>
        <div className="food-card-footer">
          <strong className="food-price">{currency.format(item.price)}</strong>
          <button
            type="button"
            className={`add-button ${quantity > 0 ? "has-quantity" : ""}`}
            onClick={() => dispatch(addToCart(item))}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} /> {quantity > 0 ? `Add more · ${quantity} in cart` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
