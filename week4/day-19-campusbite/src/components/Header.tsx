import { Heart, MapPin, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavorites,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark"><UtensilsCrossed size={21} strokeWidth={2.2} /></div>
        <div>
          <div className="brand-name">campus<span>bite</span></div>
          <div className="brand-caption">GOOD FOOD. LESS WAITING.</div>
        </div>
      </div>

      <div className="pickup-location">
        <span className="location-icon"><MapPin size={16} /></span>
        <span><small>ORDERING FROM</small><strong>Campus canteen</strong></span>
      </div>

      <label className="searchbox">
        <Search size={18} />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search food, drinks..."
          aria-label="Search menu"
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="header-actions">
        <button
          type="button"
          className={`icon-button favorite-shortcut ${showFavoritesOnly ? "is-active" : ""}`}
          onClick={onToggleFavorites}
          aria-label="Show favourites"
          title="Favourites"
        >
          <Heart size={19} />
          {favoritesCount > 0 && <span className="tiny-badge">{favoritesCount}</span>}
        </button>
        <div className="cart-top-indicator">
          <ShoppingBag size={19} />
          <span><strong>{cartCount}</strong><small>items</small></span>
        </div>
        <div className="avatar" title="Student account">S</div>
      </div>
    </header>
  );
}
