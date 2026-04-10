import React, { useEffect, useState, useCallback } from "react";
import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const currencyFormat = (n) => `₹${Math.round(n)}`;

const Checkout = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [subscribe, setSubscribe] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [cart, setCart] = useState([]);
  const [savedAddress, setSavedAddress] = useState(null);
  const [manualBilling, setManualBilling] = useState(null);
  const [useSaved, setUseSaved] = useState(false);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  // ================= APPLY COUPON =================
  const applyCoupon = async () => {
    if (!couponCode || couponApplied) return;

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
        alert(data.message || "Coupon not valid for this order");
        setDiscount(0);
        setCouponApplied(false);
        return;
      }

      const discountAmount = (subtotal * data.discountPercent) / 100;

      setDiscount(discountAmount);
      setCouponApplied(true);

    } catch (err) {
      console.error(err);
      alert("Coupon validation failed");
    }
  };
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [addFreeProduct, setAddFreeProduct] = useState(false);

  const token = localStorage.getItem("token");

  // ================= ✅ FIXED HELPER =================
  const saveGuestCart = () => {
    return JSON.parse(Cookies.get("guestCart") || "[]");
  };

  const clearGuestCart = () => {
    Cookies.remove("guestCart");
  };

  // ================= IMAGE HELPER =================
  const getImageUrl = (photo) => {
    if (!photo) return "/images/default.jpg";

    if (Array.isArray(photo)) photo = photo[0];
    if (typeof photo === "object" && photo?.url) photo = photo.url;
    if (typeof photo !== "string") return "/images/default.jpg";

    return photo.startsWith("http")
      ? photo
      : `/images/${photo.replace("images/", "")}`;
  };

  // ================= FETCH & MERGE =================
  const mergeCart = useCallback(async () => {
    if (!token) {
      setCart(saveGuestCart());
      return;
    }

    try {
      const guestCart = saveGuestCart();

      if (guestCart.length > 0) {
        await fetch(`${API_URL}/cart/merge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ guestItems: guestCart }),
        });

        clearGuestCart(); // ✅ FIXED
      }

      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const products =
        data.cart?.items?.map((item) => {
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
              hamperItems:
                item.hamperId.products?.map((p) => ({
                  name: p.productId?.ProductName,
                  quantity: p.quantity,
                })) || [],
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
    if (!savedAddress) return;

    if (useSaved) {
      setBilling({
        name: savedAddress.name || "",
        phone: savedAddress.mobile || "",
        email: billing.email || "",
        address: savedAddress.houseNumber || "",
        city: savedAddress.city || "",
        pincode: savedAddress.pincode || "",
      });
    }
  }, [useSaved, savedAddress]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data?.address) {
          setSavedAddress(data.address);

          setBilling({
            name: data.address.name || "",
            phone: data.address.mobile || "",
            email: data.email || "",
            address: data.address.houseNumber || "",
            city: data.address.city || "",
            pincode: data.address.pincode || "",
          });
        }
      } catch (err) {
        console.log("No saved address");
      }
    };

    if (token) fetchUser();
  }, [token]);
  useEffect(() => {
    mergeCart();
  }, [mergeCart]);

  // ================= TOTAL =================
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  // ✅ TOTAL ITEMS COUNT
  const totalItems = cart.reduce((acc, it) => acc + it.qty, 0);

  // ✅ SHIPPING LOGIC
  const isHybridCOD = paymentMethod === "cod_hybrid";


  let shipping = 0;

  if (subtotal >= 1500) {
    shipping = 0;
  } else if (totalItems === 1) {
    shipping = 90;
  } else {
    shipping = totalItems * 35;
  }

  // ✅ FINAL TOTAL
  const total = subtotal - discount + shipping;
  const advanceAmount = isHybridCOD ? 200 : total;
  const ADVANCE = 200;

  const remainingCOD = isHybridCOD
    ? total - ADVANCE
    : 0;
  const hasHamper = cart.some(
    (item) =>
      item.type === "hamper" ||
      item.name?.toLowerCase().includes("hamper")
  );

  // ================= BILLING =================
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
      alert("Please fill all fields.");
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
      const orderItems = cart
        .map((item) => {
          if (item.type === "product") {
            return { productId: item.id, quantity: item.qty };
          }

          if (item.type === "hamper") {
            return {
              hamperId: item.id,
              quantity: item.qty,
              addFreeProduct,
            };
          }

          return null;
        })
        .filter(Boolean);

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

      if (
        paymentMethod === "upi" ||
        paymentMethod === "card" ||
        paymentMethod === "cod_hybrid"
      ) {
        const paymentRes = await fetch(
          `${API_URL}/payment/initiate/${data.orderId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const paymentData = await paymentRes.json();

        if (paymentData.redirect) {
          window.location.href = paymentData.redirect;
          return;
        }

        alert("Payment failed");
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
                  <input
                    type="checkbox"
                    checked={useSaved}
                    onChange={() => {
                      if (!useSaved) {
                        // Save current manual input before switching
                        setManualBilling(billing);
                      } else {
                        // Restore manual input when unchecked
                        if (manualBilling) setBilling(manualBilling);
                      }

                      setUseSaved(!useSaved);
                    }}
                  />
                  <div className="payment-block mt-4">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                      {["upi", "card", "cod_hybrid"].map((op) => (
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
                              : "₹200 Advance + Remaining COD"}
                        </label>
                      ))}
                    </div>
                  </div>
                  {isHybridCOD && (
                    <div className="hybrid-cod-box">
                      <div className="hybrid-title">
                        💡 How Hybrid COD works:
                      </div>
                      <ol className="hybrid-list">
                        <li>
                          Pay <strong>{currencyFormat(advanceAmount)}</strong> online now to confirm your order this amount will be not refunded in any case
                        </li>
                        <li>
                          Pay the remaining <strong>{currencyFormat(remainingCOD)}</strong> in cash when delivered
                        </li>
                        <li>
                          Your order will be processed only after online payment
                        </li>
                      </ol>
                    </div>
                  )}
                  <div className="form-actions">
                    <button
                      className="btn-outline-dark btn"
                      type="submit"
                      disabled={placing}
                    >
                      {placing
                        ? "Processing..."
                        : isHybridCOD
                          ? `Pay ₹200 Now`
                          : paymentMethod === "upi" || paymentMethod === "card"
                            ? `Pay Now — ${currencyFormat(total)}`
                            : `Place Order`}
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
                      disabled={couponApplied}
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
                    <span>
                      {shipping === 0 ? "FREE" : currencyFormat(shipping)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-5">
                    <span>Discount</span>
                    <span>- {currencyFormat(discount)}</span>
                  </div>


                  <div className="d-flex justify-content-between total">
                    <strong>Total</strong>
                    <strong>{currencyFormat(total)}</strong>
                  </div>
                  {/* ✅ ADD HERE */}
                  {isHybridCOD && (
                    <>
                      <div className="d-flex justify-content-between">
                        <span>Advance Paid</span>
                        <span>{currencyFormat(advanceAmount)}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Pay on Delivery</span>
                        <span>{currencyFormat(remainingCOD)}</span>
                      </div>
                    </>
                  )}
                  {/* <div className="d-flex justify-content-between total">
                    <strong>Total</strong>
                    <strong>{currencyFormat(total)}</strong>
                  </div> */}

                  {/* ✅ ADD HERE 👇 */}

                </div>
              </div>
            </aside>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Checkout;

