import React, { useEffect, useState } from "react";
import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL;
const currencyFormat = (n) => `₹${Math.round(n)}`;

const Checkout = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [subscribe, setSubscribe] = useState(false);
  const COUPONS = {
    LAUNCH5: 5,
    WELCOME10: 10,
  };
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
  const [addFreeProduct, setAddFreeProduct] = useState(false);

  const token = localStorage.getItem("token");

  // ================= HELPER =================
  const saveGuestCart = () => {
    // Save guest cart locally
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    return guestCart;
  };
  const applyCoupon = async () => {
    if (!couponCode) return;

    try {
      const res = await fetch(`${API_URL}/orders/coupon/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ couponCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setDiscount(0);
        return;
      }

      setDiscount((subtotal * data.discountPercent) / 100);

    } catch (err) {
      console.error(err);
      alert("Coupon validation failed");
    }
  };
  const clearGuestCart = () => localStorage.removeItem("guestCart");

  // ================= FETCH & MERGE CART =================
  const getImageUrl = (photo) => {
    if (!photo) return "/images/default.jpg";

    // if it's an array, take first element
    if (Array.isArray(photo)) photo = photo[0];

    // if it's an object with url, use it
    if (typeof photo === "object" && photo?.url) photo = photo.url;

    // if it's still not string, fallback
    if (typeof photo !== "string") return "/images/default.jpg";

    // finally, return full URL
    return photo.startsWith("http") ? photo : `/images/${photo.replace("images/", "")}`;
  };
  const mergeCart = useCallback(async () => {
    if (!token) {
      setCart(saveGuestCart());
      return;
    }

    try {
      const guestCart = saveGuestCart();

      if (guestCart.length > 0) {
        await fetch(`${API_URL}/merge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ guestItems: guestCart }),
        });
        clearGuestCart();
      }

      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const products = data.cart?.items?.map((item) => {
        if (item.productId) {
          return {
            id: item.productId?._id || item.productId,
            type: "product",
            name: item.productId.ProductName,
            price: item.productId.ProductPrice,
            qty: item.quantity,
            img: getImageUrl(item.productId.Photos),
          };
        }

        if (item.hamperId) {
          return {
            id: item.hamperId._id,
            type: "hamper",
            name: "Custom Hamper",
            price: item.hamperId.totalPrice,
            qty: item.quantity,
            img: "/images/hamper.jpg",
          };
        }

        return null;
      }) || [];

      setCart(products.filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch or merge cart:", err);
    }
  }, [token]);
  useEffect(() => {
    const handleCartUpdate = () => {
      mergeCart(); // ✅ refresh cart when event fires
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [mergeCart]);
  useEffect(() => {
    mergeCart(); // ✅ load cart on page open
  }, [mergeCart]);
  // ================= TOTAL =================
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const total = subtotal - discount;
  const hasHamper = cart.some(
    (item) =>
      item.type === "hamper" ||
      item.name?.toLowerCase().includes("hamper")
  );
  // ================= HANDLERS =================
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
      let orderItems = cart.map((item) => {

        // ✅ NORMAL PRODUCT
        if (item.type === "product") {
          return {
            productId: item.id,
            quantity: item.qty,
          };
        }

        // ✅ HAMPER
        if (item.type === "hamper") {
          return {
            hamperId: item.id,
            quantity: item.qty,
            addFreeProduct: addFreeProduct // 👈 send flag to backend
          };
        }

        return null;
      }).filter(Boolean);



      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          paymentMethod,
          couponCode,
          subscribe,
          address: {
            houseNumber: billing.address,
            buildingName: billing.name,
            city: billing.city,
            pincode: billing.pincode,
            mobile: billing.phone,
          },
          customerName: billing.name,
          customerEmail: billing.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setPlacing(false);
        return;
      }

      // ONLINE PAYMENT
      if (paymentMethod === "upi" || paymentMethod === "card") {
        const paymentRes = await fetch(
          `${API_URL}/payment/initiate/${data.orderId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const paymentData = await paymentRes.json();

        if (paymentData.redirect) {
          window.location.href = paymentData.redirect;
          return;
        }

        alert("Failed to initiate payment");
        setPlacing(false);
        return;
      }

      alert("Order placed successfully!");
      window.location.href = "/payment";

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setPlacing(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="checkout sora">
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

                <div className="payment-block mt-4">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    {["upi", "card"].map((op) => (
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
            <div className="panel-inner order-summary">
              <h2 className="summary-title">Order Summary</h2>

              {/* PRODUCT LIST */}
              <div className="items-list">
                {cart.map((it) => (
                  <div key={it.id} className="item-row d-flex gap-3">

                    {/* ✅ IMAGE */}
                    <img
                      src={it.img}
                      alt={it.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />

                    <div>
                      <div className="name">{it.name}</div>
                      <div>x{it.qty}</div>

                      {it.hamperItems && (
                        <ul style={{ fontSize: "12px", marginTop: "5px" }}>
                          {it.hamperItems.map((h, i) => (
                            <li key={i}>
                              {h.name} × {h.quantity}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>
                ))}
              </div>

              {/* COUPON */}
              {/* COUPON */}
              {/* COUPON */}
              <div className="coupon-box mt-3">

                <div className="coupon-container">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="coupon-input"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />

                  <button className="coupon-btn sora" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>

              </div>

              <div className="newsletter-subscription mt-3 d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#7c3aed', borderBlockColor: 'black' }}
                />
                <label htmlFor="newsletter" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Subscribe to our Newsletter
                </label>
              </div>

              {/* ✅ FREE PRODUCT (ONLY FOR HAMPER) */}
              {hasHamper && (
                <div className="free-product-box mt-3 d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id="freeProduct"
                    checked={addFreeProduct}
                    onChange={(e) => setAddFreeProduct(e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label
                    htmlFor="freeProduct"
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    Add Complimentary Free Product
                  </label>
                </div>
              )}
              {/* PRICE BREAKDOWN */}
              <div className="price-breakdown mt-4">
                <div className="d-flex justify-content-between">
                  <span>Subtotal · {cart.length} item</span>
                  <span>{currencyFormat(subtotal)}</span> {/* ✅ FIX */}
                </div>

                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>-</span>
                </div>

                <div className="d-flex justify-content-between mt-5">
                  <span>Discount</span>
                  <span>- {currencyFormat(discount)}</span>
                </div>

                <div className="d-flex justify-content-between total">
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
