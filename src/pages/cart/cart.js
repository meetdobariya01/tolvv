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
            name: item.productId?.ProductName,
            price: item.productId?.ProductPrice,
            qty: item.quantity,
            img: getImageUrl(item.productId?.Photos),
            category: item.productId?.Category,
          })) || [];

        setCartItems(items);
        setTotalPrice(items.reduce((s, i) => s + i.price * i.qty, 0));
        fetchRelatedProducts(items);
      } else {
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

        const formatted = await Promise.all(
          guestCart.map(async (item) => {
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

    if (token) {
      await axios.post(
        `${API_URL}/add-to-cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
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

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <Header />

      <div className="cart-wrapper sora">
        <div className="container">
          <div className="row min-vh-100">

            {/* LEFT : RELATED PRODUCTS */}
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
              <h6 className="mb-4">CART</h6>

              {cartItems.map((item) => (
                <motion.div key={item.id} className="cartpage-item mb-3 p-3 border rounded">
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img src={item.img} className="img-fluid" alt={item.name} />
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
                      <FiTrash2 onClick={() => removeItem(item.id)} />
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="border rounded p-3 mt-4">
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