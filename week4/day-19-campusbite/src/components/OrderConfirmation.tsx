import { Check, Clock3, ReceiptText, X } from "lucide-react";
import type { CartItem } from "../features/cart/cartSlice";

interface OrderConfirmationProps {
  orderNumber: string;
  items: CartItem[];
  total: number;
  onClose: () => void;
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OrderConfirmation({ orderNumber, items, total, onClose }: OrderConfirmationProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title">
        <button type="button" className="modal-close icon-button" onClick={onClose} aria-label="Close confirmation"><X size={19} /></button>
        <div className="success-icon"><Check size={29} strokeWidth={2.5} /></div>
        <span className="eyebrow">ORDER CONFIRMED</span>
        <h2 id="order-confirmation-title">You’re all set!</h2>
        <p className="modal-intro">Your demo order is in. Take a breather — we’ll see you at the counter.</p>
        <div className="order-number-card"><span><ReceiptText size={16} /> Order reference</span><strong>{orderNumber}</strong></div>
        <div className="order-details-title"><span>Order summary</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
        <div className="order-confirmation-items">
          {items.map((item) => <div className="confirmation-item" key={item.foodId}><span>{item.quantity} × {item.name}</span><strong>{currency.format(item.price * item.quantity)}</strong></div>)}
        </div>
        <div className="confirmation-total"><span>Total paid in demo</span><strong>{currency.format(total)}</strong></div>
        <div className="ready-time"><Clock3 size={16} /><span>Estimated pickup in <strong>10–15 minutes</strong></span></div>
        <button type="button" className="checkout-button confirmation-done" onClick={onClose}>Back to the menu</button>
        <p className="demo-disclaimer">This is a practice project. No order was sent to a real canteen.</p>
      </section>
    </div>
  );
}
