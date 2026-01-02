// // import React, { useEffect, useState } from "react";
// // import "./checkout.css";
// // import Header from "../../components/header/header";
// // import Footer from "../../components/footer/footer";

// // // Show amounts as whole numbers
// // const currencyFormat = (n) => `₹${Math.round(n)}`;
// // const API_URL = process.env.REACT_APP_API_URL;
// // const Checkout = () => {
// //   const [cart, setCart] = useState([]);
// //   const [cartId, setCartId] = useState("");
// //   const [billing, setBilling] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     address: "",
// //     city: "",
// //     pincode: "",
// //   });
// //   const [paymentMethod, setPaymentMethod] = useState("upi");
// //   const [placing, setPlacing] = useState(false);

// //   const token = localStorage.getItem("token");

// //   useEffect(() => {
// //     fetch(`${API_URL}/cart`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     })
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.cart?.items?.length > 0) {
// //           const products = data.cart.items.map((item) => ({
// //             id: item.productId._id,
// //             name: item.productId.ProductName,
// //             price: item.productId.ProductPrice,
// //             qty: item.quantity,
// //             img: item.productId.Photos?.startsWith("http")
// //               ? item.productId.Photos
// //               : `/images/${item.productId.Photos?.replace(
// //                   "images/",
// //                   ""
// //                 )}`,
// //           }));
// //           setCart(products);
// //           setCartId(data.cart._id);
// //         }
// //       })
// //       .catch((err) => console.error("Failed to fetch cart:", err));
// //   }, [token]);

// //   // Calculate amounts as integers
// //   const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
// //   const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;

// //   const total = subtotal ;

// //   const handleBillingChange = (e) => {
// //     const { name, value } = e.target;
// //     setBilling((b) => ({ ...b, [name]: value }));
// //   };

// //   const validate = () => {
// //     if (cart.length === 0) return alert("Your cart is empty.");
// //     if (!billing.name || !billing.email || !billing.phone)
// //       return alert("Please fill in Name, Email & Phone.");
// //     return true;
// //   };

// //  const placeOrder = async (e) => {
// //   e.preventDefault();
// //   if (!validate()) return;
// //   setPlacing(true);

// //   try {

// //     const totalAmount = subtotal;

// //     // Prepare items for backend
// //     const orderItems = cart.map((item) => ({
// //       id: item.id,
// //       qty: item.qty,
// //       price: item.price,
// //       productId: item.id, // must match backend schema
// //       quantity: item.qty,
// //       priceAtBuy: item.price,
// //     }));

// //     const res = await fetch(`${API_URL}/place-order`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         items: orderItems,
// //         paymentMethod,
// //         address: {
// //           houseNumber: billing.address,
// //           buildingName: billing.name,
// //           city: billing.city,
// //           pincode: billing.pincode,
// //         },
// //       }),
// //     });

// //     const data = await res.json();

// //     if (!res.ok) {
// //       alert(data.message || "Order failed");
// //       setPlacing(false);
// //       return;
// //     }

// //     // Online payment redirect
// //     if (paymentMethod === "upi" || paymentMethod === "card") {
// //       if (data.redirect) {
// //         window.location.href = data.redirect;
// //       } else {
// //         alert("Failed to initiate payment");
// //       }
// //     } else {
// //       // COD
// //       window.location.href = `https://tolvvsigns.com/payment`;
// //     }
// //   } catch (error) {
// //     console.error(error);
// //     alert("Something went wrong.");
// //   }

// //   setPlacing(false);
// // };


// //   return (
// //     <div>
// //       <Header />
// //       <div className="checkout-root">
// //         <h1 className="page-title">Checkout</h1>

// //         <div className="checkout-grid">
// //           <div className="panel billing-panel">
// //             <div className="panel-inner">
// //               <h2>Billing & Shipping</h2>

// //               <form onSubmit={placeOrder} className="billing-form" noValidate>
// //                 <label>
// //                   Full name
// //                   <input
// //                     name="name"
// //                     value={billing.name}
// //                     onChange={handleBillingChange}
// //                     required
// //                   />
// //                 </label>
// //                 <label>
// //                   Email
// //                   <input
// //                     name="email"
// //                     type="email"
// //                     value={billing.email}
// //                     onChange={handleBillingChange}
// //                     required
// //                   />
// //                 </label>

// //                 <div className="row-two">
// //                   <label>
// //                     Phone
// //                     <input
// //                       name="phone"
// //                       value={billing.phone}
// //                       onChange={handleBillingChange}
// //                       required
// //                     />
// //                   </label>
// //                   <label>
// //                     Pincode
// //                     <input
// //                       name="pincode"
// //                       value={billing.pincode}
// //                       onChange={handleBillingChange}
// //                     />
// //                   </label>
// //                 </div>

// //                 <label>
// //                   Address
// //                   <textarea
// //                     name="address"
// //                     value={billing.address}
// //                     onChange={handleBillingChange}
// //                     rows="3"
// //                   />
// //                 </label>
// //                 <label>
// //                   City
// //                   <input name="city" value={billing.city} onChange={handleBillingChange} />
// //                 </label>

// //                 <div className="payment-block">
// //                   <h3>Payment Method</h3>
// //                   <div className="payment-options">
// //                     {["upi", "card", "cod"].map((op) => (
// //                       <label key={op} className={paymentMethod === op ? "active" : ""}>
// //                         <input
// //                           type="radio"
// //                           name="payment"
// //                           value={op}
// //                           checked={paymentMethod === op}
// //                           onChange={() => setPaymentMethod(op)}
// //                         />
// //                         {op === "upi"
// //                           ? "UPI / Google Pay"
// //                           : op === "card"
// //                           ? "Credit / Debit Card"
// //                           : "Cash on Delivery"}
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="form-actions">
// //                   <button className="place-btn" type="submit" disabled={placing}>
// //                     {placing ? "Processing..." : `Pay — ${currencyFormat(total)}`}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>

// //           <aside className="panel summary-panel">
// //             <div className="panel-inner">
// //               <h2>Order Summary</h2>
// //               <div className="items-list">
// //                 {cart.length === 0 ? (
// //                   <div className="empty-cart">Your cart is empty</div>
// //                 ) : (
// //                   cart.map((it) => (
// //                     <div className="cart-item" key={it.id}>
// //                       <img src={it.img} alt={it.name} className="cart-thumb" />
// //                       <div className="cart-meta">
// //                         <div className="name">{it.name}</div>
// //                         <div className="meta-row">
// //                           <span>x{it.qty}</span>
// //                           <div className="price">{currencyFormat(it.price * it.qty)}</div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>

// //               <div className="price-breakdown">
// //                 <div className="row">
// //                   <span>Subtotal</span>
// //                   <span>{currencyFormat(subtotal)}</span>
// //                 </div>
// //                 <div className="row">
// //                   <span>Shipping</span>
// //                   <span>{shipping === 0 ? "FREE" : currencyFormat(shipping)}</span>
// //                 </div>
// //                 <div className="row total">
// //                   <strong>Total</strong>
// //                   <strong>{currencyFormat(total)}</strong>
// //                 </div>
// //               </div>
// //             </div>
// //           </aside>
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Checkout;


// import React, { useEffect, useState } from "react";
// import "./checkout.css";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";

// const API_URL = process.env.REACT_APP_API_URL;

// // Show amounts as whole numbers
// const currencyFormat = (n) => `₹${Math.round(n)}`;

// const Checkout = () => {
//   const [cart, setCart] = useState([]);
//   const [billing, setBilling] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     pincode: "",
//   });
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [placing, setPlacing] = useState(false);
//   const [orderId, setOrderId] = useState(null);

//   const token = localStorage.getItem("token");

//   // Fetch cart on mount
//   useEffect(() => {
//     fetch(`${API_URL}/cart`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.cart?.items?.length > 0) {
//           const products = data.cart.items.map((item) => ({
//             id: item.productId._id,
//             name: item.productId.ProductName,
//             price: item.productId.ProductPrice,
//             qty: item.quantity,
//             img: item.productId.Photos?.startsWith("http")
//               ? item.productId.Photos
//               : `/images/${item.productId.Photos?.replace("images/", "")}`,
//           }));
//           setCart(products);
//         }
//       })
//       .catch((err) => console.error("Failed to fetch cart:", err));
//   }, [token]);

//   // Calculate subtotal and shipping
//   const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
//   const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
//   const total = subtotal + shipping;

//   // Handle billing inputs
//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBilling((b) => ({ ...b, [name]: value }));
//   };

//   // Validate form before order
//   const validate = () => {
//     if (cart.length === 0) {
//       alert("Your cart is empty.");
//       return false;
//     }
//     if (
//       !billing.name ||
//       !billing.email ||
//       !billing.phone ||
//       !billing.address ||
//       !billing.city ||
//       !billing.pincode
//     ) {
//       alert("Please fill all billing and shipping fields.");
//       return false;
//     }
//     return true;
//   };

//   // Poll order status after redirect
//   useEffect(() => {
//     let interval;
//     if (placing && orderId && paymentMethod !== "cod") {
//       interval = setInterval(async () => {
//         try {
//           const res = await fetch(`${API_URL}/order-status/${orderId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const data = await res.json();
//           if (data.status === "PAID") {
//             clearInterval(interval);
//             alert("Payment successful!");
//             window.location.href = `/order/${orderId}`;
//           } else if (data.status === "PAYMENT_FAILED") {
//             clearInterval(interval);
//             alert("Payment failed!");
//           }
//         } catch (err) {
//           console.error("Error checking order status:", err);
//         }
//       }, 5000);
//     }
//     return () => clearInterval(interval);
//   }, [placing, orderId, paymentMethod, token]);

//   // Place order
//   const placeOrder = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setPlacing(true);

//     try {
//       const orderItems = cart.map((item) => ({
//         productId: item.id,
//         quantity: item.qty,
//       }));

//       const res = await fetch(`${API_URL}/place-order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           items: orderItems,
//           paymentMethod,
//           address: {
//             houseNumber: billing.address,
//             buildingName: billing.name,
//             city: billing.city,
//             pincode: billing.pincode,
//           },
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Order failed");
//         setPlacing(false);
//         return;
//       }

//       // Save orderId to poll status if needed
//       setOrderId(data.orderId);

//       // Online payment redirect
//       if (paymentMethod === "upi" || paymentMethod === "card") {
//         if (data.redirect) {
//           window.location.href = data.redirect;
//         } else {
//           alert("Failed to initiate payment");
//         }
//       } else {
//         // COD
//         window.location.href = `https://tolvvsigns.com/payment`;
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong.");
//     }

//     setPlacing(false);
//   };

//   return (
//     <div>
//       <Header />
//       <div className="checkout-root">
//         <h1 className="page-title">Checkout</h1>
//         <div className="checkout-grid">
//           <div className="panel billing-panel">
//             <div className="panel-inner">
//               <h2>Billing & Shipping</h2>
//               <form onSubmit={placeOrder} className="billing-form" noValidate>
//                 <label>
//                   Full name
//                   <input name="name" value={billing.name} onChange={handleBillingChange} required />
//                 </label>
//                 <label>
//                   Email
//                   <input name="email" type="email" value={billing.email} onChange={handleBillingChange} required />
//                 </label>
//                 <div className="row-two">
//                   <label>
//                     Phone
//                     <input name="phone" value={billing.phone} onChange={handleBillingChange} required />
//                   </label>
//                   <label>
//                     Pincode
//                     <input name="pincode" value={billing.pincode} onChange={handleBillingChange} required />
//                   </label>
//                 </div>
//                 <label>
//                   Address
//                   <textarea name="address" value={billing.address} onChange={handleBillingChange} rows="3" required />
//                 </label>
//                 <label>
//                   City
//                   <input name="city" value={billing.city} onChange={handleBillingChange} required />
//                 </label>

//                 <div className="payment-block">
//                   <h3>Payment Method</h3>
//                   <div className="payment-options">
//                     {["upi", "card", "cod"].map((op) => (
//                       <label key={op} className={paymentMethod === op ? "active" : ""}>
//                         <input
//                           type="radio"
//                           name="payment"
//                           value={op}
//                           checked={paymentMethod === op}
//                           onChange={() => setPaymentMethod(op)}
//                         />
//                         {op === "upi" ? "UPI / Google Pay" : op === "card" ? "Credit / Debit Card" : "Cash on Delivery"}
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button className="place-btn" type="submit" disabled={placing}>
//                     {placing ? "Processing..." : `Pay — ${currencyFormat(total)}`}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           <aside className="panel summary-panel">
//             <div className="panel-inner">
//               <h2>Order Summary</h2>
//               <div className="items-list">
//                 {cart.length === 0 ? (
//                   <div className="empty-cart">Your cart is empty</div>
//                 ) : (
//                   cart.map((it) => (
//                     <div className="cart-item" key={it.id}>
//                       <img src={it.img} alt={it.name} className="cart-thumb" />
//                       <div className="cart-meta">
//                         <div className="name">{it.name}</div>
//                         <div className="meta-row">
//                           <span>x{it.qty}</span>
//                           <div className="price">{currencyFormat(it.price * it.qty)}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div className="price-breakdown">
//                 <div className="row">
//                   <span>Subtotal</span>
//                   <span>{currencyFormat(subtotal)}</span>
//                 </div>
//                 <div className="row">
//                 </div>
//                 <div className="row total">
//                   <strong>Total</strong>
//                   <strong>{currencyFormat(total)}</strong>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Checkout;



import React, { useEffect, useState } from "react";
import "./checkout.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_URL = process.env.REACT_APP_API_URL;
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
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH CART =================
  useEffect(() => {
    fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart?.items?.length > 0) {
          const products = data.cart.items.map((item) => ({
            id: item.productId._id,
            name: item.productId.ProductName,
            price: item.productId.ProductPrice,
            qty: item.quantity,
            img: item.productId.Photos?.startsWith("http")
              ? item.productId.Photos
              : `/images/${item.productId.Photos?.replace("images/", "")}`,
          }));
          setCart(products);
        }
      })
      .catch((err) => console.error("Failed to fetch cart:", err));
  }, [token]);

  // ================= TOTAL =================
  const subtotal = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
  const total = subtotal;

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
          address: {
            houseNumber: billing.address,
            buildingName: billing.name,
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

      // 💵 COD
      window.location.href = `/order-success/${data.orderId}`;

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setPlacing(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="checkout-root">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-grid">
          <div className="panel billing-panel">
            <div className="panel-inner">
              <h2>Billing & Shipping</h2>

              <form onSubmit={placeOrder} className="billing-form" noValidate>
                <label>
                  Full name
                  <input name="name" value={billing.name} onChange={handleBillingChange} required />
                </label>

                <label>
                  Email
                  <input name="email" type="email" value={billing.email} onChange={handleBillingChange} required />
                </label>

                <div className="row-two">
                  <label>
                    Phone
                    <input name="phone" value={billing.phone} onChange={handleBillingChange} required />
                  </label>

                  <label>
                    Pincode
                    <input name="pincode" value={billing.pincode} onChange={handleBillingChange} required />
                  </label>
                </div>

                <label>
                  Address
                  <textarea name="address" value={billing.address} onChange={handleBillingChange} rows="3" required />
                </label>

                <label>
                  City
                  <input name="city" value={billing.city} onChange={handleBillingChange} required />
                </label>

                <div className="payment-block">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    {["upi", "card", "cod"].map((op) => (
                      <label key={op} className={paymentMethod === op ? "active" : ""}>
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
                  <button className="place-btn" type="submit" disabled={placing}>
                    {placing ? "Processing..." : `Pay — ${currencyFormat(total)}`}
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
                    <img src={it.img} alt={it.name} className="cart-thumb" />
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
