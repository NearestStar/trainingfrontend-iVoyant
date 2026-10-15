import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock3, Coffee, Heart, Leaf, Search, ShoppingBag, Sparkles, Utensils } from "lucide-react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import CartPanel from "./components/CartPanel";
import FoodCard from "./components/FoodCard";
import Header from "./components/Header";
import OrderConfirmation from "./components/OrderConfirmation";
import { clearCart, type CartItem } from "./features/cart/cartSlice";
import { foodItems, menuCategories, type MenuCategory } from "./features/menu/menuData";
import "./App.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

interface PlacedOrder {
  number: string;
  items: CartItem[];
  total: number;
}

export default function App() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return foodItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = !query || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query);
      const matchesFavorites = !showFavoritesOnly || favoriteIds.includes(item.id);
      const matchesDiet = !showVegetarianOnly || item.isVegetarian;
      return matchesCategory && matchesSearch && matchesFavorites && matchesDiet;
    });
  }, [activeCategory, searchQuery, showFavoritesOnly, showVegetarianOnly, favoriteIds]);

  function handleCheckout() {
    if (cartItems.length === 0) return;
    const items = cartItems.map((item) => ({ ...item }));
    const total = subtotal + 5;
    const number = `CB-${String(Date.now()).slice(-6)}`;
    setPlacedOrder({ number, items, total });
    dispatch(clearCart());
    setCartOpen(false);
  }

  return (
    <div className="app-shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        favoritesCount={favoriteIds.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((current) => !current)}
      />

      <main className="page-layout">
        <section className="main-column">
          <div className="welcome-line"><span className="status-dot" /> YOUR CAMPUS, YOUR COMFORT FOOD <span className="welcome-line-right">Made fresh, made for you</span></div>

          <section className="hero-banner">
            <div className="hero-content">
              <span className="hero-kicker"><Sparkles size={14} /> THE GOOD STUFF IS HERE</span>
              <h1>Big day?<br /><span>Eat something good.</span></h1>
              <p>Between classes, deadlines and everything else — your next favourite bite is just a few clicks away.</p>
              <button type="button" className="hero-cta" onClick={() => { setActiveCategory("All"); setShowFavoritesOnly(false); document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the menu <ArrowRight size={16} /></button>
              <div className="hero-trust-row"><span><Check size={14} /> Student-friendly prices</span><span><Check size={14} /> Easy counter pickup</span></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
              <div className="hero-image-card"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85" alt="" /><div className="hero-image-caption"><span className="caption-icon"><Leaf size={15} /></span><span><strong>Good food mood</strong><small>Something for everyone</small></span></div></div>
              <div className="floating-note note-rating"><span className="rating-star">★</span><span><strong>4.8/5</strong><small>student picks</small></span></div>
              <div className="floating-note note-time"><Clock3 size={17} /><span><strong>Quick bites</strong><small>4–15 min prep</small></span></div>
            </div>
            <div className="hero-decor decor-circle" />
          </section>

          <section className="benefit-strip" aria-label="Ordering benefits">
            <div className="benefit-item"><span className="benefit-icon mint"><Clock3 size={18} /></span><span><strong>Made to order</strong><small>Fresh, never forgotten</small></span></div>
            <div className="benefit-item"><span className="benefit-icon peach"><Coffee size={18} /></span><span><strong>Student prices</strong><small>Little joys, fair prices</small></span></div>
            <div className="benefit-item"><span className="benefit-icon lilac"><ShoppingBag size={18} /></span><span><strong>Simple pickup</strong><small>Order now, collect later</small></span></div>
          </section>

          <section className="menu-section" id="menu-section">
            <div className="section-heading">
              <div><span className="eyebrow">THE CANTEEN MENU</span><h2>{showFavoritesOnly ? "Your favourites" : "Find your happy plate"}</h2><p>Made fresh and priced for campus life.</p></div>
              <div className="menu-result-count">{filteredItems.length} tasty {filteredItems.length === 1 ? "option" : "options"}</div>
            </div>

            <div className="menu-controls">
              <div className="category-tabs" role="group" aria-label="Filter by category">
                {menuCategories.map((category) => <button type="button" key={category} className={`category-tab ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}
              </div>
              <button type="button" className={`diet-filter ${showVegetarianOnly ? "active" : ""}`} onClick={() => setShowVegetarianOnly((current) => !current)}><Leaf size={14} /> Veg only <span className="toggle-dot"><Check size={10} /></span></button>
            </div>

            {(searchQuery.trim() || showFavoritesOnly || showVegetarianOnly) && <div className="active-filter-line"><span>{showFavoritesOnly && <><Heart size={13} /> Favourites</>}{showVegetarianOnly && <><Leaf size={13} /> Vegetarian</>}{searchQuery.trim() && <><Search size={13} /> “{searchQuery.trim()}”</>}</span><button type="button" onClick={() => { setSearchQuery(""); setShowFavoritesOnly(false); setShowVegetarianOnly(false); }}>Clear filters <ArrowRight size={13} /></button></div>}

            {filteredItems.length > 0 ? <div className="food-grid">{filteredItems.map((item) => <FoodCard item={item} key={item.id} />)}</div> : (
              <div className="no-results"><div className="no-results-icon"><Search size={24} /></div><h3>No bites found</h3><p>Try another search or clear a filter — there’s got to be something good.</p><button type="button" className="outline-button" onClick={() => { setSearchQuery(""); setShowFavoritesOnly(false); setShowVegetarianOnly(false); setActiveCategory("All"); }}>Show the whole menu</button></div>
            )}
          </section>

          <footer className="page-footer"><div className="footer-brand"><div className="footer-mark"><Utensils size={16} /></div><span>campusbite</span></div><span>Made for hungry students and busy days.</span><span className="footer-note">A learning project · Not a live ordering service</span></footer>
        </section>

        <div className="cart-desktop"><CartPanel onCheckout={handleCheckout} /></div>
      </main>

      {cartCount > 0 && <button type="button" className="mobile-cart-bar" onClick={() => setCartOpen(true)}><span className="mobile-cart-icon"><ShoppingBag size={18} /><span>{cartCount}</span></span><span>View your order</span><strong>{currency.format(subtotal + 5)} <ArrowRight size={16} /></strong></button>}

      {cartOpen && <div className="mobile-cart-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><CartPanel mobile onClose={() => setCartOpen(false)} onCheckout={handleCheckout} /></div>}

      {placedOrder && <OrderConfirmation orderNumber={placedOrder.number} items={placedOrder.items} total={placedOrder.total} onClose={() => setPlacedOrder(null)} />}
    </div>
  );
}
