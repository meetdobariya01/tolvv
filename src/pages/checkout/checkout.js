// src/components/Checkout.jsx
import React, { useEffect, useState } from "react";
import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

/*
  Fully working checkout page component.
  - Drop into src/components/Checkout.jsx
  - Import and render <Checkout /> in App.jsx or a route.
*/

const SAMPLE_CART = [
  {
    id: 1,
    name: "Aroma Bath Gel — Aries Edition",
    price: 799.0,
    qty: 1,
    img: "./images/product/perfume/aries-perfume.jpg",
  },
  {
    id: 2,
    name: "Premium Perfume — Aries Blend",
    price: 1499.0,
    qty: 2,
    img: "./images/product/essential-oil/aries-essential-oil.jpg",
  },
  {
    id: 3,
    name: "Essential Oil — Aries Scent",
    price: 499.0,
    qty: 1,
    img: "./images/product/body-lotion/virgo-body-lotion.jpg",
  },
];

const currencyFormat = (n) => {
  // convert to fixed 2 decimal digits as string, step-by-step
  const fixed = Number(n).toFixed(2); // returns string e.g. "1299.00"
  return `₹${fixed}`;
};

const Checkout = () => {
  const [cart, setCart] = useState(SAMPLE_CART);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Recalculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99; // example rule
  const gst = +(subtotal * 0.18).toFixed(2); // 18% GST
  const total = +(subtotal + shipping + gst).toFixed(2);

  // Quantity handlers
  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
        )
        .filter(Boolean)
    );
    // add subtle animation class
    const el = document.querySelector(`[data-item-id="${id}"]`);
    if (el) {
      el.classList.add("pulse");
      setTimeout(() => el.classList.remove("pulse"), 300);
    }
  }

  function updateQtyDirect(id, value) {
    const v = Number(value);
    if (Number.isNaN(v) || v < 1) return;
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: v } : it))
    );
  }

  function removeItem(id) {
    const el = document.querySelector(`[data-item-id="${id}"]`);
    if (el) {
      el.classList.add("remove-anim");
      setTimeout(
        () => setCart((prev) => prev.filter((it) => it.id !== id)),
        320
      );
    } else {
      setCart((prev) => prev.filter((it) => it.id !== id));
    }
  }

  function handleBillingChange(e) {
    const { name, value } = e.target;
    setBilling((b) => ({ ...b, [name]: value }));
  }

  function validate() {
    // Basic client-side validation
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return false;
    }
    if (
      !billing.name.trim() ||
      !billing.email.trim() ||
      !billing.phone.trim()
    ) {
      alert("Please fill in Name, Email and Phone.");
      return false;
    }
    // email simple check
    if (!/^\S+@\S+\.\S+$/.test(billing.email)) {
      alert("Please enter a valid email.");
      return false;
    }
    if (!/^\d{6,}$/.test(billing.pincode) && billing.pincode !== "") {
      alert("Pincode looks invalid (should be 6+ digits).");
      return false;
    }
    return true;
  }

  function placeOrder(e) {
    e.preventDefault();
    if (!validate()) return;

    setPlacing(true);
    // simulate API call with animation
    setTimeout(() => {
      setPlacing(false);
      setOrderPlaced(true);
      // clear cart
      setCart([]);
      // success animation
      const success = document.querySelector(".order-success");
      if (success) {
        success.classList.add("glow");
        setTimeout(() => success.classList.remove("glow"), 1500);
      }
    }, 1100);
  }

  useEffect(() => {
    // small mount animation
    const container = document.querySelector(".checkout-root");
    if (container) {
      container.classList.add("enter");
      setTimeout(() => container.classList.remove("enter"), 600);
    }
  }, []);

  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="checkout-root">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-grid">
          {/* LEFT - Billing / Shipping */}
          <div className="panel billing-panel">
            <div className="panel-inner">
              <h2>Billing & Shipping</h2>

              <form onSubmit={placeOrder} className="billing-form" noValidate>
                <label>
                  Full name
                  <input
                    name="name"
                    value={billing.name}
                    onChange={handleBillingChange}
                    placeholder="Rahul Sharma"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    value={billing.email}
                    onChange={handleBillingChange}
                    placeholder="you@example.com"
                    type="email"
                    required
                  />
                </label>

                <div className="row-two">
                  <label>
                    Phone
                    <input
                      name="phone"
                      value={billing.phone}
                      onChange={handleBillingChange}
                      placeholder="+91 9XXXXXXXXX"
                      type="tel"
                      required
                    />
                  </label>

                  <label>
                    Pincode
                    <input
                      name="pincode"
                      value={billing.pincode}
                      onChange={handleBillingChange}
                      placeholder="380001"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <label>
                  Address
                  <textarea
                    name="address"
                    value={billing.address}
                    onChange={handleBillingChange}
                    placeholder="Street, area, landmark..."
                    rows="3"
                  />
                </label>

                <label>
                  City
                  <input
                    name="city"
                    value={billing.city}
                    onChange={handleBillingChange}
                    placeholder="Ahmedabad"
                  />
                </label>

                {/* Payment options inline for mobile friendly */}
                <div className="payment-block">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    <label className={paymentMethod === "upi" ? "active" : ""}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                      />
                      UPI / Google Pay
                    </label>

                    <label className={paymentMethod === "card" ? "active" : ""}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      Credit / Debit Card
                    </label>

                    <label className={paymentMethod === "cod" ? "active" : ""}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="place-btn"
                    type="submit"
                    disabled={placing}
                    aria-busy={placing}
                  >
                    {placing
                      ? "Placing order..."
                      : `Place order — ${currencyFormat(total)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <aside className="panel summary-panel">
            <div className="panel-inner">
              <h2>Order Summary</h2>

              <div className="items-list">
                {cart.length === 0 ? (
                  <div className="empty-cart">Your cart is empty</div>
                ) : (
                  cart.map((it) => (
                    <div
                      className="cart-item"
                      key={it.id}
                      data-item-id={it.id}
                      aria-live="polite"
                    >
                      <img src={it.img} alt={it.name} className="cart-thumb" />
                      <div className="cart-meta">
                        <div className="name">{it.name}</div>
                        <div className="meta-row">
                          <div className="qty-controls">
                            <button
                              className="qty-btn"
                              onClick={() => changeQty(it.id, -1)}
                              aria-label={`Decrease quantity for ${it.name}`}
                            >
                              −
                            </button>
                            <input
                              className="qty-input"
                              value={it.qty}
                              onChange={(e) =>
                                updateQtyDirect(it.id, e.target.value)
                              }
                              inputMode="numeric"
                              aria-label={`Quantity for ${it.name}`}
                            />
                            <button
                              className="qty-btn"
                              onClick={() => changeQty(it.id, +1)}
                              aria-label={`Increase quantity for ${it.name}`}
                            >
                              +
                            </button>
                          </div>

                          <div className="price">
                            {currencyFormat(it.price * it.qty)}
                          </div>
                        </div>
                      </div>

                      <button
                        className="remove"
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remove ${it.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="price-breakdown">
                <div className="row">
                  <span>Subtotal</span>
                  <span>{currencyFormat(subtotal)}</span>
                </div>
                <div className="row">
                  <span>GST (18%)</span>
                  <span>{currencyFormat(gst)}</span>
                </div>
                <div className="row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "FREE" : currencyFormat(shipping)}
                  </span>
                </div>
                <div className="row total">
                  <strong>Total</strong>
                  <strong>{currencyFormat(total)}</strong>
                </div>
              </div>

              <div className="order-success" aria-hidden={!orderPlaced}>
                {orderPlaced ? (
                  <div>
                    <div className="success-emoji">✅</div>
                    <div className="success-text">
                      Order placed successfully!
                    </div>
                  </div>
                ) : (
                  <small className="tip">
                    Secure checkout • 256-bit encryption
                  </small>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Checkout;
