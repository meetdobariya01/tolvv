import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Aries Bath Gel",
      price: 499,
      qty: 1,
      img: "./images/product/bath-gel/aries-bath-gel.jpg",
      desc: "Refreshing bath gel with natural essential oils.",
    },
    {
      id: 2,
      name: "Aries Perfume",
      price: 1299,
      qty: 1,
      img: "./images/product/perfume/aries-perfume.jpg",
      desc: "Long-lasting luxury fragrance for daily use.",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <div>
      {/* Header Spacer */}
      <Header />

      <div className="container py-5">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center fw-bold"
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
                  {/* Image */}
                  <div className="col-md-3 text-center">
                    <motion.img
                      src={item.img}
                      className="img-fluid rounded-4"
                      alt={item.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Details */}
                  <div className="col-md-6">
                    <h5 className="fw-bold">{item.name}</h5>
                    <p className="text-muted small">{item.desc}</p>
                    <p className="fw-semibold mb-1">₹{item.price}</p>
                  </div>

                  {/* Quantity + Delete */}
                  <div className="col-md-3 text-center">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <button
                        className="btn btn-outline-dark px-3"
                        onClick={() => decreaseQty(item.id)}
                      >
                        −
                      </button>
                      <span className="px-3 fw-bold">{item.qty}</span>
                      <button
                        className="btn btn-outline-dark px-3"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
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

          {/* Right Side Total Card */}
          <div className="col-lg-4">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
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
                  style={{ display: "block" }}
                >
                  Proceed to Checkout
                </NavLink>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Spacer */}
      <Footer />
    </div>
  );
};

export default Cart;
