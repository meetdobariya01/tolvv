import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.cart?.items?.length > 0) {
          const items = res.data.cart.items.map((item) => ({
            id: item.productId?._id,
            name: item.productId?.ProductName,
            price: item.productId?.ProductPrice,
            qty: item.quantity,
            img: item.productId?.Photos
              ? item.productId.Photos.startsWith("http")
                ? item.productId.Photos
                : `/images/${item.productId.Photos.replace("images/", "")}`
              : "/images/default.jpg",
            desc: item.productId?.Description || "",
          })).filter((i) => i.id); // remove null product IDs

          setCartItems(items);

          // sum = price * qty
          const total = items.reduce((t, i) => t + i.price * i.qty, 0);
          setTotalPrice(total);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, [token]);


  const increaseQty = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      await axios.post(
        `${API_URL}/add-to-cart`,
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateQty(id, item.qty + 1);
    } catch (err) {
      console.error("Failed to increase qty:", err);
    }
  };

  const decreaseQty = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.qty <= 1) return;

    updateQty(id, item.qty - 1);
  };

  const updateQty = (id, qty) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
    const item = cartItems.find((i) => i.id === id);
    setTotalPrice((prev) => prev + item.price * (qty - item.qty));
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const item = cartItems.find((i) => i.id === id);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      setTotalPrice((prev) => prev - item.price * item.qty);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center  your-cart-title"
        >
          🛒 Your Cart
        </motion.h2>

        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="card p-3 shadow-sm border-0 rounded-4 mb-3"
              >
                <div className="row align-items-center">
                  <div className="col-md-3 text-center">
                    <motion.img
                      src={item.img}
                      className="img-fluid rounded-4"
                      alt={item.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      style={{ height: 150, width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-bold">{item.name}</h5>
                    <p className="text-muted small">{item.desc}</p>
                    <p className="fw-semibold mb-1">₹{item.price}</p>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <button className="btn btn-outline-dark px-3" onClick={() => decreaseQty(item.id)}>
                        −
                      </button>
                      <span className="px-3 fw-bold">{item.qty}</span>
                      <button className="btn btn-outline-dark px-3" onClick={() => increaseQty(item.id)}>
                        +
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      className="btn btn-danger rounded-circle"
                      onClick={() => removeItem(item.id)}
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

            {cartItems.length === 0 && (
              <motion.h4
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted mt-4"
              >
                Your cart is empty!
              </motion.h4>
            )}
          </div>

          <div className="col-lg-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-4 shadow-lg border-0 rounded-4"
            >
              <h4 className="fw-bold mb-3">Order Summary</h4>

              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">Shipping:</span>
                <span>₹0 (Free)</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold">Total:</h5>
                <h5 className="fw-bold">₹{totalPrice}</h5>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-dark w-100 py-2 rounded-4 fw-semibold"
              >
                <NavLink
                  to="/check-out"
                  className="text-white text-decoration-none d-block w-100 h-100"
                >
                  Proceed to Checkout
                </NavLink>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
