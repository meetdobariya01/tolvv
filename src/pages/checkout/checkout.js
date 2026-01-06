import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const currencyFormat = (n) => `₹${Math.round(n)}`;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Checkout = () => {
  const [cart, setCart] = useState([]);
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

  const token = localStorage.getItem("token");
const location = useLocation();
  const note = location.state?.note ;
  // -----------------------------
  // FETCH CART (LOGGED-IN USER)
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const items =
          data?.cart?.items?.map((item) => {
            const photo = item.productId?.Photos;

            return {
              id: item.productId?._id,
              name: item.productId?.ProductName,
              price: item.productId?.ProductPrice,
              qty: item.quantity,
              img: photo
                ? photo.startsWith("http")
                  ? photo
                  : `${API_URL}${photo}`
                : `${API_URL}/images/product-grid.png`,
            };
          }) || [];

        setCart(items);
      })
      .catch((err) => console.error("Failed to fetch cart:", err));
  }, [token]);

  // -----------------------------
  // TOTALS
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const total = subtotal;

  // -----------------------------
  // FORM HANDLERS
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((b) => ({ ...b, [name]: value }));
  };

  const validate = () => {
    if (cart.length === 0) return alert("Your cart is empty.");
    if (!billing.name || !billing.email || !billing.phone)
      return alert("Please fill Name, Email & Phone.");
    return true;
  };

  // -----------------------------
  // PLACE ORDER
  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setPlacing(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      }));

      const res = await fetch(`${API_URL}/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
       body: JSON.stringify({
  items: orderItems,
  paymentMethod,
  note, // ✅ ADD THIS LINE
  address: {
    name: billing.name,
    phone: billing.phone,
    email: billing.email,
    address: billing.address,
    city: billing.city,
    pincode: billing.pincode,
  },
}),

      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setPlacing(false);
        return;
      }

      // PAYMENT FLOW
      if (paymentMethod === "upi" || paymentMethod === "card") {
        if (data.redirect) window.location.href = data.redirect;
        else alert("Payment initiation failed");
      } else {
        alert("Order placed successfully (COD)");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setPlacing(false);
  };

  // -----------------------------
  // UI
  return (
    <div>
      <Header />

      <div className="checkout-root">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-grid">
          {/* BILLING */}
          <div className="panel billing-panel">
            <div className="panel-inner">
              <h2>Billing & Shipping</h2>

              <form onSubmit={placeOrder} className="billing-form">
                <input name="name" placeholder="Full Name" onChange={handleBillingChange} />
                <input name="email" placeholder="Email" onChange={handleBillingChange} />
                <input name="phone" placeholder="Phone" onChange={handleBillingChange} />
                <input name="pincode" placeholder="Pincode" onChange={handleBillingChange} />
                <textarea name="address" placeholder="Address" onChange={handleBillingChange} />
                <input name="city" placeholder="City" onChange={handleBillingChange} />

                <div className="payment-options">
                  {["upi", "card", "cod"].map((m) => (
                    <label key={m}>
                      <input
                        type="radio"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                      />
                      {m.toUpperCase()}
                    </label>
                  ))}
                </div>

                <button disabled={placing} className="place-btn">
                  {placing ? "Processing..." : `Pay — ${currencyFormat(total)}`}
                </button>
              </form>
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="panel summary-panel">
            <div className="panel-inner">
              <h2>Order Summary</h2>

              {cart.map((it) => (
                <div className="cart-item" key={it.id}>
                  <img src={it.img} alt={it.name} />
                  <div>
                    <div>{it.name}</div>
                    <small>x{it.qty}</small>
                  </div>
                  <strong>{currencyFormat(it.price * it.qty)}</strong>
                </div>
              ))}

              <div className="price-breakdown">
                <div>Subtotal: {currencyFormat(subtotal)}</div>
                <div>Shipping: {shipping === 0 ? "FREE" : currencyFormat(shipping)}</div>
                <div className="total">Total: {currencyFormat(total)}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
