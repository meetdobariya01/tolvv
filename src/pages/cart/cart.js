<<<<<<< HEAD
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

// /* Recommended Products */
// const recommendedProducts = {
//   "Body Lotion": { price: 750, desc: "Deeply nourishing body lotion for smooth and hydrated skin." },
//   Perfume: { price: 1200, desc: "Long-lasting premium fragrance crafted with fine oils." },
//   "Essential Oil": { price: 950, desc: "Pure essential oil for relaxation and aromatherapy." },
//   Soap: { price: 350, desc: "Gentle soap made with natural cleansing ingredients." },
// };

// const Cart = () => {
//   const [selectedProduct, setSelectedProduct] = useState("Body Lotion");
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPrice, setTotalPrice] = useState(0);

//   // Shipping + Note
//   const [shipping, setShipping] = useState({ country: "", city: "", zip: "" });
//   const [note, setNote] = useState("");

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // ---------------- FETCH CART ----------------
//   const fetchCart = useCallback(async () => {
//     setLoading(true);

//     if (token) {
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
//                   : `${photo}`
//                 : `/images/product-grid.png`,
//             };
//           }) || [];

//         setCartItems(items);
//         setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
//       } catch (err) {
//         console.error("Fetch cart failed:", err);
//         setCartItems([]);
//       }
//     } else {
//       let guestCart = [];
//       try {
//         guestCart = JSON.parse(Cookies.get("guestCart") || "[]");
//       } catch {
//         guestCart = [];
//       }

//       const formatted = await Promise.all(
//         guestCart.map(async (item) => {
//           try {
//             const res = await axios.get(`${API_URL}/api/products/${item.productId}`);
//             return {
//               id: item.productId,
//               name: res.data.ProductName,
//               price: res.data.ProductPrice,
//               qty: item.quantity || 1,
//               img: res.data.Photos
//                 ? res.data.Photos.startsWith("http")
//                   ? res.data.Photos
//                   : `{res.data.Photos}`
//                 : `/images/product-grid.png`,
//             };
//           } catch {
//             return {
//               id: item.productId,
//               name: "Product",
//               price: item.price || 0,
//               qty: item.quantity || 1,
//               img: `/images/product-grid.png`,
//             };
//           }
//         })
//       );

//       setCartItems(formatted);
//       setTotalPrice(formatted.reduce((sum, i) => sum + i.price * i.qty, 0));
//     }

//     setLoading(false);
//   }, [token]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   // ---------------- GUEST CART UPDATE ----------------
//   const updateGuestCart = (items) => {
//     setCartItems(items);
//     Cookies.set(
//       "guestCart",
//       JSON.stringify(
//         items.map((i) => ({
//           productId: i.id,
//           quantity: i.qty,
//           price: i.price,
//           img: i.img,
//           note,
//         }))
//       ),
//       { expires: 2 }
//     );
//     setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
//   };

//   // ---------------- QUANTITY ----------------
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
//     updateGuestCart(cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
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
//     updateGuestCart(cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)));
//   };

//   // ---------------- REMOVE ----------------
//   const removeItem = async (id) => {
//     if (token) {
//       await axios.delete(`${API_URL}/api/cart/remove/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCart();
//       return;
//     }
//     updateGuestCart(cartItems.filter((i) => i.id !== id));
//   };

//   // ---------------- CHECKOUT ----------------
//   const handleCheckout = () => {
//     if (!token) navigate("/login");
//     else navigate("/Check-out", { state: { note, shipping } });
//   };

//   if (loading)
//     return <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>Loading...</div>;

//   return (
//     <>
//       <Header />

//       <div className="cart-wrapper sora">
//         <div className="container">
//           <div className="row min-vh-100">

//             {/* LEFT */}
//             <div className="col-lg-6 left-panel">
//               <h6 className="mb-5">You may also like</h6>
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
//               <p className="text-muted mt-3">
//                 {recommendedProducts[selectedProduct].desc}
//               </p>
//             </div>

//             {/* RIGHT */}
//             <div className="col-lg-6 right-panel my-5">
//               <div className="cart-header">
//                 <h6>CART</h6>
//                 <span className="close" onClick={() => navigate("/")}>×</span>
//               </div>

//               {cartItems.map((item) => (
//                 <motion.div key={item.id} className="cartpage-item mb-3 p-3 border rounded-3">
//                   <div className="row align-items-center">
//                     <div className="col-3">
//                       <img src={item.img} className="img-fluid rounded" alt={item.name} />
//                     </div>
//                     <div className="col-6">
//                       <h6>{item.name}</h6>
//                       <p>₹{item.price}</p>
//                       <div className="qty-box">
//                         <button onClick={() => decreaseQty(item.id)}>-</button>
//                         <span>{item.qty}</span>
//                         <button onClick={() => increaseQty(item.id)}>+</button>
//                       </div>
//                     </div>
//                     <div className="col-3 text-end">
//                       <FiTrash2 className="text-danger cursor-pointer" onClick={() => removeItem(item.id)} />
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}

//               {/* SHIPPING */}
//               <div className="border rounded-3 p-3 mt-4">
//                 <h6>Estimate shipping</h6>
//                 <input className="form-control mb-2" placeholder="Country" onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
//                 <input className="form-control mb-2" placeholder="City" onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
//                 <input className="form-control mb-3" placeholder="Postal / ZIP Code" onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
//                 <button className="btn btn-outline-dark w-100">CHECK DURATION</button>
//               </div>

//               {/* NOTE */}
//               <div className="mt-4">
//                 <h6>Add a note</h6>
//                 <textarea className="form-control" rows="4" value={note} onChange={(e) => setNote(e.target.value)} />
//               </div>

//               {/* TOTAL */}
//               <div className="border rounded-3 p-3 mt-4">
//                 <div className="d-flex justify-content-between">
//                   <span>Subtotal</span>
//                   <span>₹{totalPrice}</span>
//                 </div>
//                 <div className="d-flex justify-content-between fw-bold mt-2">
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
=======
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
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

/* IMAGE HELPER */
const getImageUrl = (photo) => {
  if (!photo) return "/images/product-grid.png";
  if (photo.startsWith("http")) return photo;
  return `/${photo.replace(/^\/+/, "")}`;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const [shipping, setShipping] = useState({ country: "", city: "", zip: "" });
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ---------------- FETCH CART ---------------- */
  const fetchCart = useCallback(async () => {
    setLoading(true);

    try {
      if (token) {
        const res = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items =
          res.data?.cart?.items?.map((item) => ({
            id: item.productId?._id,
<<<<<<< HEAD
            name: item.productId?.ProductName || "Product",
            price: item.productId?.ProductPrice || 0,
            qty: item.quantity || 1,
            img: item.productId?.Photos,
=======
            name: item.productId?.ProductName,
            price: item.productId?.ProductPrice,
            qty: item.quantity,
            img: getImageUrl(item.productId?.Photos),
            category: item.productId?.Category,
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
          })) || [];

        setCartItems(items);
        setTotalPrice(items.reduce((s, i) => s + i.price * i.qty, 0));
        fetchRelatedProducts(items);
      } else {
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

        const formatted = await Promise.all(
          guestCart.map(async (item) => {
<<<<<<< HEAD
            try {
              const res = await axios.get(
                `${API_URL}/api/products/${item.productId}`,
              );

              return {
                id: item.productId,
                name: res.data.ProductName || "Product",
                price: res.data.ProductPrice || 0,
                qty: item.quantity || 1,
                img: getImageUrl(res.data.Photos),
              };
            } catch {
              return {
                id: item.productId,
                name: "Product",
                price: item.price || 0,
                qty: item.quantity || 1,
                img: getImageUrl(null),
              };
            }
          }),
=======
            const res = await axios.get(`${API_URL}/products/${item.productId}`);
            return {
              id: item.productId,
              name: res.data.ProductName,
              price: res.data.ProductPrice,
              qty: item.quantity,
              img: getImageUrl(res.data.Photos),
              category: res.data.Category,
            };
          })
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
        );

        setCartItems(formatted);
        setTotalPrice(formatted.reduce((s, i) => s + i.price * i.qty, 0));
        fetchRelatedProducts(formatted);
      }
    } catch (err) {
      console.error("Cart error:", err);
      setCartItems([]);
    }

    setLoading(false);
  }, [token]);

  /* ---------------- RELATED PRODUCTS ---------------- */
  const fetchRelatedProducts = async (items) => {
    if (!items.length) return;

    try {
      const category = items[0].category;
      const res = await axios.get(`${API_URL}/products`);

      const filtered = res.data.filter(
        (p) => p.Category === category && p._id !== items[0].id
      );

      setRelatedProducts(filtered.slice(0, 4));
    } catch (err) {
      console.error("Related products error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* ---------------- ADD RELATED PRODUCT TO CART ---------------- */
  const addRelatedToCart = async (product) => {
    if (!product) return;

<<<<<<< HEAD
    Cookies.set(
      "guestCart",
      JSON.stringify(
        items.map((i) => ({
          productId: i.id,
          quantity: i.qty,
          price: i.price,
          img: i.img,
          note,
        })),
      ),
      { expires: 2 },
    );

    setTotalPrice(items.reduce((s, i) => s + i.price * i.qty, 0));
  };

  /* --------------------------------------------------
     QUANTITY HANDLERS
  -------------------------------------------------- */
  const increaseQty = async (id) => {
    if (token) {
      await axios.post(
        `${API_URL}/api/add-to-cart`,
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
=======
    if (token) {
      await axios.post(
        `${API_URL}/add-to-cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
      );
    } else {
<<<<<<< HEAD
      updateGuestCart(
        cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
      );
=======
      let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

      const existing = guestCart.find((i) => i.productId === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({
          productId: product._id,
          quantity: 1,
          price: product.ProductPrice,
        });
      }

      Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 7 });
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
    }

    fetchCart();
  };

  /* ---------------- CART ACTIONS ---------------- */
const increaseQty = async (id) => {
  await axios.post(
    `${API_URL}/cart/add`,
    { productId: id, quantity: 1 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  fetchCart();
};
  const decreaseQty = async (id) => {
  await axios.post(
    `${API_URL}/cart/add`,
    { productId: id, quantity: -1 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  fetchCart();
};

<<<<<<< HEAD
    if (token) {
      await axios.post(
        `${API_URL}/api/add-to-cart`,
        { productId: id, quantity: -1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart();
    } else {
      updateGuestCart(
        cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)),
      );
    }
  };
  const checkDelivery = () => {
    if (!shipping.zip) {
      setDeliveryMsg("Please enter ZIP code");
      return;
    }

    // Later you can connect real courier API
    setDeliveryMsg(
      "Your order is scheduled to arrive in approximately 5 to 7 days",
    );
  };
  /* --------------------------------------------------
     REMOVE ITEM
  -------------------------------------------------- */
=======
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
  const removeItem = async (id) => {
    await axios.delete(`${API_URL}/cart/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  const handleCheckout = () => {
    if (!token) navigate("/login");
    else navigate("/Check-out", { state: { note, shipping } });
  };

<<<<<<< HEAD
  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        Loading...
      </div>
    );
=======
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457

  return (
    <>
      <Header />

      <div className="cart-wrapper sora">
        <div className="container">
          <div className="row min-vh-100">
<<<<<<< HEAD
            {/* LEFT */}
=======

            {/* LEFT : RELATED PRODUCTS */}
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
            <div className="col-lg-6 left-panel">
              <h6 className="mb-4">You may also like</h6>

              {relatedProducts.map((product) => (
                <div key={product._id} className="d-flex gap-3 mb-4 align-items-center">

                  <img
                    src={getImageUrl(product.Photos)}
                    alt={product.ProductName}
                    width="70"
                    height="70"
                    style={{ objectFit: "cover", borderRadius: "6px", cursor: "pointer" }}
                    onClick={() => navigate(`/productdetails/${product._id}`)}
                  />

                  <div className="flex-grow-1">
                    <p
                      className="mb-1 fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/productdetails/${product._id}`)}
                    >
                      {product.ProductName}
                    </p>

                    <p className="mb-2 text-muted">₹{product.ProductPrice}</p>

                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => addRelatedToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}

              {!relatedProducts.length && (
                <p className="text-muted">No related products found</p>
              )}
            </div>

            {/* RIGHT : CART */}
            <div className="col-lg-6 right-panel my-5">
<<<<<<< HEAD
              <div className="cart-header">
                <h6>CART</h6>
                <span className="close" onClick={() => navigate("/")}>
                  ×
                </span>
              </div>

              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="cartpage-item mb-3 p-3 border rounded-3"
                >
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img
                        src={item.img}
                        className="img-fluid rounded"
                        alt={item.name}
                      />
=======
              <h6 className="mb-4">CART</h6>

              {cartItems.map((item) => (
                <motion.div key={item.id} className="cartpage-item mb-3 p-3 border rounded">
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img src={item.img} className="img-fluid" alt={item.name} />
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
                    </div>
                    <div className="col-6">
                      <h6>{item.name}</h6>
                      <div className="qty-box">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                    </div>
                    <div className="col-3 text-end">
<<<<<<< HEAD
                      <p>₹{item.price}</p>
                      <FiTrash2
                        className="text-dark cursor-pointer"
                        onClick={() => removeItem(item.id)}
                      />
=======
                      <FiTrash2 onClick={() => removeItem(item.id)} />
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
                    </div>
                  </div>
                </motion.div>
              ))}
<<<<<<< HEAD
              <div className=" p-3 mt-4">
                <h6>Estimate shipping</h6>
                <input
                  className="form-control mb-2"
                  placeholder="Country"
                  onChange={(e) =>
                    setShipping({ ...shipping, country: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="City"
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                />
                <h6 className="mt-3">ZIP Code</h6>
                {/* ZIP code input with numeric validation */}

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Postal / ZIP Code"
                  value={shipping.zip}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                    setShipping({ ...shipping, zip: value });
                  }}
                />

                <button
                  className="btn btn-outline-dark w-50"
                  onClick={checkDelivery}
                >
                  CHECK DELIVERY TIME
                </button>

                {deliveryMsg && (
                  <p className="mt-2 text-success">{deliveryMsg}</p>
                )}
              </div>
              {/* NOTE */}
              {/* <div className="mt-4">
                <h6>Add a Note</h6>
                <textarea
                  className="form-control"
                  rows="4"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div> */}
              <hr />
              {/* TOTAL */}
              <div className="p-3 mt-4">
=======

              <div className="border rounded p-3 mt-4">
>>>>>>> 7510bfc643ec65ddd512432f10dc2e7f14a55457
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mt-2">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
                <button
                  className="btn btn-outline-dark w-25 mt-3 "
                  onClick={handleCheckout}
                >
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