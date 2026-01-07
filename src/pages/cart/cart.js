// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { FiTrash2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";
// import Cookies from "js-cookie";
// import "./cart.css";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// /* Recommended Products for Left Panel */
// const recommendedProducts = {
//   "Body Lotion": { price: 750, desc: "Deeply nourishing body lotion for smooth and hydrated skin." },
//   Perfume: { price: 1200, desc: "Long-lasting premium fragrance crafted with fine oils." },
//   "Essential Oil": { price: 950, desc: "Pure essential oil for relaxation and aromatherapy." },
//   Soap: { price: 350, desc: "Gentle soap made with natural cleansing ingredients." },
// };

// const Cart = () => {
//   const [selectedProduct, setSelectedProduct] = useState("Body Lotion"); // For left panel highlight
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPrice, setTotalPrice] = useState(0);

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // -----------------------------
//   // FETCH CART
//   const fetchCart = useCallback(async () => {
//     setLoading(true);

//     if (token) {
//       // Logged-in user
//       try {
//         const res = await axios.get(`${API_URL}/api/cart`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const items =
//           res.data?.cart?.items?.map((item) => {
//             const photo = item.productId?.Photos;
//             return {
//               id: item.productId?._id,
//               name: item.productId?.ProductName || "Product",
//               price: item.productId?.ProductPrice || 0,
//               qty: item.quantity || 1,
//               img: photo
//                 ? photo.startsWith("http")
//                   ? photo
//                   : `${API_URL}${photo}`
//                 : `${API_URL}/images/product-grid.png`,
//             };
//           }) || [];

//         setCartItems(items);
//         setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
//       } catch (err) {
//         console.error("Failed to fetch cart:", err);
//         setCartItems([]);
//       }
//     } else {
//       // Guest user
//       let guestCart = [];
//       try {
//         const stored = Cookies.get("guestCart");
//         guestCart = stored ? JSON.parse(stored) : [];
//         if (!Array.isArray(guestCart)) guestCart = [];
//       } catch {
//         guestCart = [];
//       }

// const formatted = await Promise.all(
//   guestCart.map(async (item) => {
//     try {
//       const res = await axios.get(`${API_URL}/api/products/${item.productId}`);
//       return {
//         id: item.productId,
//         name: res.data.ProductName,
//         price: res.data.ProductPrice,
//         qty: item.quantity || 1,
//         img: res.data.Photos
//           ? res.data.Photos.startsWith("http")
//             ? res.data.Photos
//             : `${API_URL}${res.data.Photos}`
//           : `${API_URL}/images/product-grid.png`,
//       };
//     } catch (err) {
//       console.error("Failed to fetch product for guest cart:", err);
//       return {
//         id: item.productId,
//         name: "Product",
//         price: item.price || 0,
//         qty: item.quantity || 1,
//         img: `${API_URL}/images/product-grid.png`,
//       };
//     }
//   })
// );

// setCartItems(formatted);
// setTotalPrice(formatted.reduce((sum, i) => sum + i.price * i.qty, 0));


//       setCartItems(formatted);
//       setTotalPrice(formatted.reduce((sum, i) => sum + i.price * i.qty, 0));
//     }

//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   // -----------------------------
//   // UPDATE GUEST CART
//   // const updateGuestCart = (items) => {
//   //   setCartItems(items);
//   //   Cookies.set(
//   //     "guestCart",
//   //     JSON.stringify(
//   //       items.map((i) => ({
//   //         productId: i.id,
//   //         name: i.name,
//   //         price: i.price,
//   //         quantity: i.qty,
//   //         img: i.img.replace(API_URL, ""),
//   //       }))
//   //     ),
//   //     { expires: 7 }
//   //   );
//   //   setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
//   // };
// const updateGuestCart = (items) => {
//   setCartItems(items);

//   Cookies.set(
//     "guestCart",
//     JSON.stringify(
//       items.map((i) => ({
//         productId: i.id,
//         name: i.name,
//         price: i.price,
//         quantity: i.qty,
//         img: i.img, // ✅ FIX
//         note: i.note || "",
//       }))
//     ),
//     { expires: 2 }
//   );

//   setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
// };




//   // -----------------------------
//   // QUANTITY HANDLERS
//   const increaseQty = async (id) => {
//     if (token) {
//       await axios.post(
//         `${API_URL}/api/add-to-cart`,
//         { productId: id, quantity: 1 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchCart();
//       return;
//     }

//     const updated = cartItems.map((i) =>
//       i.id === id ? { ...i, qty: i.qty + 1 } : i
//     );
//     updateGuestCart(updated);
//   };

//   const decreaseQty = async (id) => {
//     const item = cartItems.find((i) => i.id === id);
//     if (!item || item.qty <= 1) return;

//     if (token) {
//       await axios.post(
//         `${API_URL}/api/add-to-cart`,
//         { productId: id, quantity: -1 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchCart();
//       return;
//     }

//     const updated = cartItems.map((i) =>
//       i.id === id ? { ...i, qty: i.qty - 1 } : i
//     );
//     updateGuestCart(updated);
//   };

//   // -----------------------------
//   // REMOVE ITEM
//   const removeItem = async (id) => {
//     if (token) {
//       await axios.delete(`${API_URL}/api/cart/remove/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCart();
//       return;
//     }

//     const updated = cartItems.filter((i) => i.id !== id);
//     updateGuestCart(updated);
//   };

//   // -----------------------------
//   // CHECKOUT
//   const handleCheckout = () => {
//     if (!token) navigate("/login");
//     else navigate("/Check-out");
//   };

//   // -----------------------------
//   // UI
//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
//         Loading...
//       </div>
//     );

//   if (!cartItems.length)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <h4 className="text-muted mt-5">Your cart is empty</h4>
//           <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
//             Continue Shopping
//           </button>
//         </div>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />
//       <div className="cart-wrapper">
//         <div className="container">
//           <div className="row min-vh-100">

//             {/* LEFT SIDE: Recommended Products */}
//             <div className="col-lg-6 left-panel">
//               <h6 className="section-title">You may also like</h6>
//               <ul className="suggest-list">
//                 {Object.keys(recommendedProducts).map((item) => (
//                   <li
//                     key={item}
//                     className={item === selectedProduct ? "active" : ""}
//                     onClick={() => setSelectedProduct(item)}
//                   >
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* RIGHT SIDE: Cart Items */}
//             <div className="col-lg-6 right-panel my-5">
//               <div className="cart-header">
//                 <h6>CART</h6>
//                 <span className="close">×</span>
//               </div>

//               {cartItems.map((item) => (
//                 <motion.div key={item.id} className="cartpage-item mb-3 p-3 border rounded-3">
//                   <div className="row align-items-center">
//                     <div className="col-3">
//                       <img src={item.img} className="img-fluid rounded" alt={item.name} />
//                     </div>
//                     <div className="col-6">
//                       <h6 className="fw-bold">{item.name}</h6>
//                       <p className="text-muted">₹{item.price}</p>
//                       <div className="qty-box mt-2">
//                         <button onClick={() => decreaseQty(item.id)}>-</button>
//                         <span className="mx-2">{item.qty}</span>
//                         <button onClick={() => increaseQty(item.id)}>+</button>
//                       </div>
//                     </div>
//                     <div className="col-3 text-end">
//                       <span className="delete btn btn-link text-danger p-0" onClick={() => removeItem(item.id)}>
//                         <FiTrash2 />
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}

//               {/* TOTAL */}
//               <div className="total-box mt-4 p-3 border rounded-3">
//                 <div className="row-line d-flex justify-content-between">
//                   <span>Subtotal</span>
//                   <span>₹{totalPrice}</span>
//                 </div>
//                 <div className="row-line bold d-flex justify-content-between mt-2">
//                   <span>Total</span>
//                   <span>₹{totalPrice}</span>
//                 </div>
//                 <button className="btn btn-outline-dark w-100 mt-3" onClick={handleCheckout}>
//                   CHECKOUT
//                 </button>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import Cookies from "js-cookie";
import "./cart.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

/* Recommended Products */
const recommendedProducts = {
  "Body Lotion": { price: 750, desc: "Deeply nourishing body lotion for smooth and hydrated skin." },
  Perfume: { price: 1200, desc: "Long-lasting premium fragrance crafted with fine oils." },
  "Essential Oil": { price: 950, desc: "Pure essential oil for relaxation and aromatherapy." },
  Soap: { price: 350, desc: "Gentle soap made with natural cleansing ingredients." },
};

const Cart = () => {
  const [selectedProduct, setSelectedProduct] = useState("Body Lotion");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Shipping + Note
  const [shipping, setShipping] = useState({ country: "", city: "", zip: "" });
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ---------------- FETCH CART ----------------
  const fetchCart = useCallback(async () => {
    setLoading(true);

    if (token) {
      try {
        const res = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items =
          res.data?.cart?.items?.map((item) => {
            const photo = item.productId?.Photos;
            return {
              id: item.productId?._id,
              name: item.productId?.ProductName || "Product",
              price: item.productId?.ProductPrice || 0,
              qty: item.quantity || 1,
              img: photo
                ? photo.startsWith("http")
                  ? photo
                  : `${API_URL}${photo}`
                : `${API_URL}/images/product-grid.png`,
            };
          }) || [];

        setCartItems(items);
        setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
      } catch (err) {
        console.error("Fetch cart failed:", err);
        setCartItems([]);
      }
    } else {
      let guestCart = [];
      try {
        guestCart = JSON.parse(Cookies.get("guestCart") || "[]");
      } catch {
        guestCart = [];
      }

      const formatted = await Promise.all(
        guestCart.map(async (item) => {
          try {
            const res = await axios.get(`${API_URL}/api/products/${item.productId}`);
            return {
              id: item.productId,
              name: res.data.ProductName,
              price: res.data.ProductPrice,
              qty: item.quantity || 1,
              img: res.data.Photos
                ? res.data.Photos.startsWith("http")
                  ? res.data.Photos
                  : `${API_URL}${res.data.Photos}`
                : `${API_URL}/images/product-grid.png`,
            };
          } catch {
            return {
              id: item.productId,
              name: "Product",
              price: item.price || 0,
              qty: item.quantity || 1,
              img: `${API_URL}/images/product-grid.png`,
            };
          }
        })
      );

      setCartItems(formatted);
      setTotalPrice(formatted.reduce((sum, i) => sum + i.price * i.qty, 0));
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ---------------- GUEST CART UPDATE ----------------
  const updateGuestCart = (items) => {
    setCartItems(items);
    Cookies.set(
      "guestCart",
      JSON.stringify(
        items.map((i) => ({
          productId: i.id,
          quantity: i.qty,
          price: i.price,
          img: i.img,
          note,
        }))
      ),
      { expires: 2 }
    );
    setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  };

  // ---------------- QUANTITY ----------------
  const increaseQty = async (id) => {
    if (token) {
      await axios.post(
        `${API_URL}/api/add-to-cart`,
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      return;
    }
    updateGuestCart(cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decreaseQty = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.qty <= 1) return;

    if (token) {
      await axios.post(
        `${API_URL}/api/add-to-cart`,
        { productId: id, quantity: -1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      return;
    }
    updateGuestCart(cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)));
  };

  // ---------------- REMOVE ----------------
  const removeItem = async (id) => {
    if (token) {
      await axios.delete(`${API_URL}/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      return;
    }
    updateGuestCart(cartItems.filter((i) => i.id !== id));
  };

  // ---------------- CHECKOUT ----------------
  const handleCheckout = () => {
    if (!token) navigate("/login");
    else navigate("/Check-out", { state: { note, shipping } });
  };

  if (loading)
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>Loading...</div>;

  return (
    <>
      <Header />

      <div className="cart-wrapper sora">
        <div className="container">
          <div className="row min-vh-100">

            {/* LEFT */}
            <div className="col-lg-6 left-panel">
              <h6 className="mb-5">You may also like</h6>
              <ul className="suggest-list">
                {Object.keys(recommendedProducts).map((item) => (
                  <li
                    key={item}
                    className={item === selectedProduct ? "active" : ""}
                    onClick={() => setSelectedProduct(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted mt-3">
                {recommendedProducts[selectedProduct].desc}
              </p>
            </div>

            {/* RIGHT */}
            <div className="col-lg-6 right-panel my-5">
              <div className="cart-header">
                <h6>CART</h6>
                <span className="close" onClick={() => navigate("/")}>×</span>
              </div>

              {cartItems.map((item) => (
                <motion.div key={item.id} className="cartpage-item mb-3 p-3 border rounded-3">
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img src={item.img} className="img-fluid rounded" alt={item.name} />
                    </div>
                    <div className="col-6">
                      <h6>{item.name}</h6>
                      <p>₹{item.price}</p>
                      <div className="qty-box">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                    </div>
                    <div className="col-3 text-end">
                      <FiTrash2 className="text-danger cursor-pointer" onClick={() => removeItem(item.id)} />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* SHIPPING */}
              <div className="border rounded-3 p-3 mt-4">
                <h6>Estimate shipping</h6>
                <input className="form-control mb-2" placeholder="Country" onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                <input className="form-control mb-2" placeholder="City" onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                <input className="form-control mb-3" placeholder="Postal / ZIP Code" onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
                <button className="btn btn-outline-dark w-100">CHECK DURATION</button>
              </div>

              {/* NOTE */}
              <div className="mt-4">
                <h6>Add a note</h6>
                <textarea className="form-control" rows="4" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>

              {/* TOTAL */}
              <div className="border rounded-3 p-3 mt-4">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mt-2">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
                <button className="btn btn-outline-dark w-100 mt-3" onClick={handleCheckout}>
                  CHECKOUT
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
