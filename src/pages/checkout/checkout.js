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
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [manualBilling, setManualBilling] = useState(null);
  const [useSaved, setUseSaved] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
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
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const token = localStorage.getItem("token");

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

  // ================= HELPER FUNCTIONS =================
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

  // ================= FETCH SAVED ADDRESSES =================
  const fetchSavedAddresses = async () => {
    if (!token) return;
    
    setLoadingAddresses(true);
    try {
      const res = await fetch(`${API_URL}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched addresses:", data.addresses);
        setSavedAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ================= SAVE ADDRESS TO BACKEND =================
  const saveAddressToBackend = async (addressData) => {
    if (!token) return false;
    
    try {
      const payload = {
        houseNumber: addressData.houseNumber,
        buildingName: addressData.buildingName,
        city: addressData.city,
        pincode: addressData.pincode,
        mobile: addressData.mobile,
        State: addressData.State || "Gujarat",
        email: addressData.email || billing.email, // ✅ Include email
        road: addressData.road || "",
        landmark: addressData.landmark || "",
        societyName: addressData.societyName || "",
      };
      
      const res = await fetch(`${API_URL}/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Address saved successfully:", data);
        await fetchSavedAddresses(); // Refresh addresses immediately
        
        alert("Address saved successfully! You can now use it for future orders.");
        
        if (data.address && data.address._id) {
          setSelectedAddressId(data.address._id);
          setUseSaved(true);
        }
        
        return true;
      } else {
        const errorData = await res.json();
        console.error("Failed to save address:", errorData);
        alert(errorData.message || "Failed to save address. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
    return false;
  };

  // ================= DELETE SAVED ADDRESS =================
  const deleteSavedAddress = async (addressId) => {
    if (!token) return;
    
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const res = await fetch(`${API_URL}/user/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        await fetchSavedAddresses();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
          setUseSaved(false);
        }
        alert("Address deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert("Failed to delete address");
    }
  };

  // ================= FETCH & MERGE CART =================
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
        clearGuestCart();
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

  // ================= LOAD SAVED ADDRESSES ON MOUNT =================
  useEffect(() => {
    if (token) {
      fetchSavedAddresses();
    }
  }, [token]);

  // ================= HANDLE SELECTING SAVED ADDRESS =================
  useEffect(() => {
    if (useSaved && selectedAddressId) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        const fullAddress = [
          selectedAddress.houseNumber,
          selectedAddress.buildingName,
          selectedAddress.societyName,
          selectedAddress.road,
          selectedAddress.landmark
        ].filter(Boolean).join(", ");
        
        setBilling({
          name: selectedAddress.buildingName || selectedAddress.name || "",
          phone: selectedAddress.mobile || "",
          email: selectedAddress.email || billing.email || "", // ✅ Use saved address email if available
          address: fullAddress || selectedAddress.houseNumber || "",
          city: selectedAddress.city || "",
          pincode: selectedAddress.pincode || "",
        });
      }
    }
  }, [selectedAddressId, useSaved, savedAddresses, billing.email]);

  // ================= INITIAL USER DATA LOAD =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data?.email) {
          setBilling(prev => ({ ...prev, email: data.email }));
        }
        if (data?.mobile && !billing.phone) {
          setBilling(prev => ({ ...prev, phone: data.mobile }));
        }
      } catch (err) {
        console.log("Could not fetch user data");
      }
    };

    if (token) fetchUser();
  }, [token]);

  useEffect(() => {
    mergeCart();
  }, [mergeCart]);

  // ================= TOTALS =================
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const totalItems = cart.reduce((acc, it) => acc + it.qty, 0);
  const isHybridCOD = paymentMethod === "cod_hybrid";

  let shipping = 0;
  if (subtotal >= 1500) {
    shipping = 0;
  } else if (totalItems === 1) {
    shipping = 90;
  } else {
    shipping = totalItems * 35;
  }

  const total = subtotal - discount + shipping;
  const advanceAmount = isHybridCOD ? 200 : total;
  const ADVANCE = 200;
  const remainingCOD = isHybridCOD ? total - ADVANCE : 0;
  
  const hasHamper = cart.some(
    (item) => item.type === "hamper" || item.name?.toLowerCase().includes("hamper")
  );

  // ================= BILLING HANDLERS =================
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((b) => ({ ...b, [name]: value }));
    
    if (useSaved) {
      setUseSaved(false);
      setSelectedAddressId(null);
    }
  };

  const handleUseSavedToggle = () => {
    if (!useSaved) {
      if (savedAddresses.length > 0) {
        if (!selectedAddressId) {
          setSelectedAddressId(savedAddresses[0]._id);
        }
        setManualBilling(billing);
      } else {
        alert("No saved addresses found. Please save an address first.");
        return;
      }
    } else {
      if (manualBilling) {
        setBilling(manualBilling);
      }
      setSelectedAddressId(null);
    }
    setUseSaved(!useSaved);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const validate = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return false;
    }

    if (!billing.name || !billing.email || !billing.phone || 
        !billing.address || !billing.city || !billing.pincode) {
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
      // Save address if user opted to
      if (saveNewAddress && token && !useSaved) {
        const addressToSave = {
          houseNumber: billing.address.split(",")[0] || billing.address,
          buildingName: billing.name,
          city: billing.city,
          pincode: billing.pincode,
          mobile: billing.phone,
          State: "Gujarat",
          email: billing.email, // ✅ Include email when saving address
          road: billing.address,
          landmark: ""
        };
        
        await saveAddressToBackend(addressToSave);
      }

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
          couponCode: couponApplied ? couponCode : "",
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

      if (paymentMethod === "upi" || paymentMethod === "card" || paymentMethod === "cod_hybrid") {
        const paymentRes = await fetch(`${API_URL}/payment/initiate/${data.orderId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

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
        <div className="checkout-grid checkout-root">
          <div className="panel billing-panel">
            <div className="panel-inner">
              <h2>Shipping Details</h2>

              {/* Saved Addresses Section - Always show if there are addresses */}
              {token && savedAddresses.length > 0 && (
                <div className="saved-addresses-section mb-4" style={{ 
                  border: "1px solid #e0e0e0", 
                  borderRadius: "8px", 
                  padding: "15px",
                  marginBottom: "20px",
                  backgroundColor: "#f9f9f9"
                }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="useSavedAddress"
                      checked={useSaved}
                      onChange={handleUseSavedToggle}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <label htmlFor="useSavedAddress" style={{ cursor: "pointer", fontWeight: "500" }}>
                      Use a saved address
                    </label>
                  </div>

                  {useSaved && (
                    <div className="saved-addresses-list">
                      {loadingAddresses ? (
                        <p>Loading saved addresses...</p>
                      ) : (
                        savedAddresses.map((addr) => {
                          const displayAddress = [
                            addr.houseNumber,
                            addr.buildingName,
                            addr.societyName,
                            addr.road,
                            addr.landmark
                          ].filter(Boolean).join(", ");
                          
                          return (
                            <div
                              key={addr._id}
                              onClick={() => handleAddressSelect(addr._id)}
                              style={{
                                border: selectedAddressId === addr._id ? "2px solid #7c3aed" : "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "10px",
                                cursor: "pointer",
                                backgroundColor: selectedAddressId === addr._id ? "#f3e8ff" : "#fff",
                                position: "relative"
                              }}
                            >
                              <div style={{ fontWeight: "500", marginBottom: "5px" }}>
                                {addr.buildingName || addr.name || "Saved Address"}
                              </div>
                              <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                                {displayAddress || addr.houseNumber}
                              </div>
                              <div style={{ fontSize: "14px", color: "#666" }}>
                                {addr.city} - {addr.pincode}
                              </div>
                              <div style={{ fontSize: "14px", color: "#666" }}>
                                📞 {addr.mobile}
                              </div>
                              {/* ✅ Display email if it exists */}
                              {addr.email && (
                                <div style={{ fontSize: "14px", color: "#666", marginTop: "3px" }}>
                                  ✉️ {addr.email}
                                </div>
                              )}
                              {addr.isDefault && (
                                <span style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  fontSize: "12px",
                                  color: "#7c3aed",
                                  fontWeight: "500"
                                }}>
                                  Default
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSavedAddress(addr._id);
                                }}
                                style={{
                                  position: "absolute",
                                  bottom: "8px",
                                  right: "8px",
                                  background: "none",
                                  border: "none",
                                  color: "#ff4444",
                                  cursor: "pointer",
                                  fontSize: "14px"
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Show message if no saved addresses */}
              {token && savedAddresses.length === 0 && !loadingAddresses && (
                <div style={{
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  textAlign: "center",
                  backgroundColor: "#fafafa"
                }}>
                  <p style={{ margin: 0, color: "#666" }}>
                    💡 No saved addresses yet. Fill the form below and check "Save this address" to save it for future orders.
                  </p>
                </div>
              )}

              <form onSubmit={placeOrder} className="billing-form" noValidate>
                <label>
                  <input
                    name="name"
                    className="underline-input text-dark"
                    placeholder="Full name"
                    value={billing.name}
                    onChange={handleBillingChange}
                    required
                    disabled={useSaved}
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
                    disabled={useSaved}
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
                    disabled={useSaved}
                  />
                </label>

                <label>
                  <textarea
                    name="address"
                    className="underline-input"
                    placeholder="Address (House No, Building, Road, Landmark)"
                    value={billing.address}
                    onChange={handleBillingChange}
                    rows="2"
                    required
                    disabled={useSaved}
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
                      disabled={useSaved}
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
                      disabled={useSaved}
                    />
                  </label>
                </div>

                {/* Save Address Option - Only show for logged-in users and when not using saved address */}
                {token && !useSaved && (
                  <div className="save-address-option d-flex align-items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveNewAddress}
                      onChange={(e) => setSaveNewAddress(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <label htmlFor="saveAddress" style={{ cursor: "pointer", fontSize: "14px" }}>
                      Save this address for future orders
                    </label>
                  </div>
                )}

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
                    <div className="hybrid-title">💡 How Hybrid COD works:</div>
                    <ol className="hybrid-list">
                      <li>
                        Pay <strong>{currencyFormat(advanceAmount)}</strong> online now to confirm your order 
                        (this amount will not be refunded in any case)
                      </li>
                      <li>
                        Pay the remaining <strong>{currencyFormat(remainingCOD)}</strong> in cash when delivered
                      </li>
                      <li>Your order will be processed only after online payment</li>
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
                        ? "Pay ₹200 Now"
                        : paymentMethod === "upi" || paymentMethod === "card"
                          ? `Pay Now — ${currencyFormat(total)}`
                          : "Place Order"}
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
                  style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
                />
                <label htmlFor="newsletter" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Subscribe to our Newsletter
                </label>
              </div>

              {/* FREE PRODUCT FOR HAMPER */}
              {hasHamper && (
                <div className="free-product-box mt-3 d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id="freeProduct"
                    checked={addFreeProduct}
                    onChange={(e) => setAddFreeProduct(e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="freeProduct" style={{ fontSize: "14px", cursor: "pointer" }}>
                    Add Complimentary Free Product
                  </label>
                </div>
              )}

              {/* PRICE BREAKDOWN */}
              <div className="price-breakdown mt-4">
                <div className="d-flex justify-content-between">
                  <span>Subtotal · {cart.length} item(s)</span>
                  <span>{currencyFormat(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : currencyFormat(shipping)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Discount</span>
                  <span>- {currencyFormat(discount)}</span>
                </div>

                <div className="d-flex justify-content-between total">
                  <strong>Total</strong>
                  <strong>{currencyFormat(total)}</strong>
                </div>

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