import React, { useEffect, useState } from "react";
import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const currencyFormat = (n) => `₹${Math.round(n)}`;

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    note: "", 
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);

  const token = localStorage.getItem("token");

  const getImageUrl = (path) => {
    if (!path) return `${API_URL}/images/default.jpg`;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // ================= FETCH & MERGE CART =================
  useEffect(() => {
    const mergeCart = async () => {
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCart(guestCart);
        return;
      }

      try {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        if (guestCart.length > 0) {
          await fetch(`${API_URL}/merge`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ guestItems: guestCart }),
          });
          localStorage.removeItem("guestCart");
        }

        const res = await fetch(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.cart?.items?.length > 0) {
          const products = data.cart.items.map((item) => ({
            id: item.productId._id,
            name: item.productId.ProductName,
            price: item.productId.ProductPrice,
            qty: item.quantity,
            img: getImageUrl(item.productId.Photos),
          }));
          setCart(products);
        }
      } catch (err) {
        console.error("Failed to fetch or merge cart:", err);
      }
    };

    mergeCart();
  }, [token]);

  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const total = subtotal;

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((b) => ({ ...b, [name]: value }));
  };

  const validate = () => {
    if (cart.length === 0) return alert("Your cart is empty.");
    if (
      !billing.name ||
      !billing.email ||
      !billing.phone ||
      !billing.address ||
      !billing.city ||
      !billing.pincode
    ) {
      alert("Please fill all billing and shipping fields.");
      return false;
    }
    return true;
  };

  // ================= PLACE ORDER =================
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
          customerName: billing.name,
          customerEmail: billing.email,
          address: {
            houseNumber: billing.address,
            buildingName: billing.name,
            city: billing.city,
            pincode: billing.pincode,
            phone: billing.phone,
          },
          note: billing.note || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setPlacing(false);
        return;
      }

      // 🔁 ONLINE PAYMENT
      if (paymentMethod === "upi" || paymentMethod === "card") {
        if (data.redirect) {
          window.location.href = data.redirect;
          return;
        }
        alert("Failed to initiate payment");
        setPlacing(false);
        return;
      }

      // 💵 COD: show success page
      alert(`Order placed successfully! Order ID: ${data.orderId}`);
      window.location.href = "/payment"; // redirect to payment confirmation page
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setPlacing(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="checkout">
        <div className="checkout-grid checkout-root">
          <div className="panel billing-panel">
            <div className="panel-inner">
              <h2>Shipping Details</h2>

              <form onSubmit={placeOrder} className="billing-form" noValidate>
                <label>
                  <input
                    name="name"
                    className="underline-input text-dark"
                    placeholder="Full name"
                    value={billing.name}
                    onChange={handleBillingChange}
                    required
                  />
                </label>

                <label>
                  <input
                    name="phone"
                    className="underline-input"
                    placeholder="Phone"
                    value={billing.phone}
                    onChange={handleBillingChange}
                    required
                  />
                </label>

                <label>
                  <input
                    name="email"
                    className="underline-input"
                    type="email"
                    placeholder="Email"
                    value={billing.email}
                    onChange={handleBillingChange}
                    required
                  />
                </label>

                <label>
                  <textarea
                    name="address"
                    className="underline-input"
                    placeholder="Address"
                    value={billing.address}
                    onChange={handleBillingChange}
                    rows="1"
                    required
                  />
                </label>

                <div className="row-two">
                  <label>
                    <input
                      name="city"
                      className="underline-input"
                      placeholder="City"
                      value={billing.city}
                      onChange={handleBillingChange}
                      required
                    />
                  </label>
                  <label>
                    <input
                      name="pincode"
                      className="underline-input"
                      placeholder="Pincode"
                      value={billing.pincode}
                      onChange={handleBillingChange}
                      required
                    />
                  </label>
                </div>

                {/* ✅ Note field */}
                <label>
                  <textarea
                    name="note"
                    className="underline-input"
                    placeholder="Order note (optional)"
                    value={billing.note}
                    onChange={handleBillingChange}
                    rows="2"
                  />
                </label>

                <div className="payment-block mt-4">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    {["upi", "card", "cod"].map((op) => (
                      <label
                        key={op}
                        className={paymentMethod === op ? "active" : ""}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === op}
                          onChange={() => setPaymentMethod(op)}
                        />
                        {op === "upi"
                          ? "UPI / Google Pay"
                          : op === "card"
                          ? "Credit / Debit Card"
                          : "Cash on Delivery"}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn-outline-dark btn"
                    type="submit"
                    disabled={placing}
                  >
                    {placing
                      ? "Processing..."
                      : `Pay Now— ${currencyFormat(total)}`}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="panel summary-panel">
            <div className="panel-inner">
              <h2>Order Summary</h2>

              <div className="items-list">
                {cart.map((it) => (
                  <div className="cart-item" key={it.id}>
                    <img
                      src={it.img}
                      alt={it.name}
                      className="cart-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${API_URL}/images/default.jpg`;
                      }}
                    />
                    <div className="cart-meta">
                      <div className="name">{it.name}</div>
                      <div className="meta-row">
                        <span>x{it.qty}</span>
                        <div className="price">
                          {currencyFormat(it.price * it.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="price-breakdown">
                <div className="row total">
                  <strong>Total</strong>
                  <strong>{currencyFormat(total)}</strong>
                </div>
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
