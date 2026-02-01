import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Context";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          Cart is empty
          <button onClick={() => navigate("/services")}>
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price?.replace(/[^\d]/g, "")) || 0;
    return sum + price;
  }, 0);

  return (
    <div className="cart-page">
      {/* ✅ BACK BUTTON (ADDED) */}
      <button className="cart-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* HEADER */}
      <div className="cart-header">
        <h2>My Cart</h2>
        <button className="clear-cart" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      {/* CART ITEMS */}
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            {item.image && <img src={item.image} alt={item.title} />}

            <div className="cart-item-content">
              <h4>{item.title}</h4>
              <div className="duration">{item.duration}</div>
              <div className="price">{item.price}</div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="cart-footer">
        <div className="total-row">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          className="continue-btn"
          onClick={() =>
            navigate("/booking", { state: { services: cartItems } })
          }
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}
