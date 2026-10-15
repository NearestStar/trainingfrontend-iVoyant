import { Minus, Plus, ShoppingBag, Trash2, Utensils, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

interface CartPanelProps {
  onCheckout: () => void;
  onClose?: () => void;
  mobile?: boolean;
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartPanel({ onCheckout, onClose, mobile = false }: CartPanelProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = items.length > 0 ? 5 : 0;
  const total = subtotal + serviceFee;

  return (
    <aside className={`cart-panel ${mobile ? "cart-panel-mobile" : ""}`}>
      <div className="cart-heading">
        <div>
          <div className="cart-heading-title"><ShoppingBag size={19} /> Your order <span className="cart-count-pill">{itemCount}</span></div>
          <p className="cart-subtitle">A little something for your break.</p>
        </div>
        {mobile && onClose && <button type="button" className="icon-button cart-close" onClick={onClose} aria-label="Close cart"><X size={20} /></button>}
        {!mobile && items.length > 0 && <button type="button" className="clear-cart" onClick={() => dispatch(clearCart())}>Clear all</button>}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-illustration"><Utensils size={29} /></div>
          <h3>Your cart is taking a break</h3>
          <p>Find something tasty on the menu and it’ll show up here.</p>
          <span className="empty-cart-hint">Psst… the masala dosa is a favourite.</span>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {items.map((item) => (
              <div className="cart-item" key={item.foodId}>
                <img src={item.image} alt="" className="cart-item-image" />
                <div className="cart-item-info">
                  <div className="cart-item-top"><h4>{item.name}</h4><button type="button" className="remove-item" onClick={() => dispatch(removeFromCart(item.foodId))} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button></div>
                  <strong>{currency.format(item.price * item.quantity)}</strong>
                  <div className="quantity-control">
                    <button type="button" onClick={() => dispatch(decreaseQuantity(item.foodId))} aria-label={`Decrease ${item.name} quantity`}><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => dispatch(increaseQuantity(item.foodId))} aria-label={`Increase ${item.name} quantity`}><Plus size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-line"><span>Subtotal</span><span>{currency.format(subtotal)}</span></div>
            <div className="summary-line"><span>Campus service fee</span><span>{currency.format(serviceFee)}</span></div>
            <div className="summary-note">Pickup is free. We’ll have your order ready at the counter.</div>
            <div className="summary-total"><span>Total</span><strong>{currency.format(total)}</strong></div>
            <button type="button" className="checkout-button" onClick={onCheckout}>Place demo order <span>→</span></button>
            <p className="secure-note">Demo checkout · No payment will be taken</p>
          </div>
        </>
      )}
    </aside>
  );
}
