import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        // --- LOGGED IN USER LOGIC ---
        try {
          const res = await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data?.cart?.items) {
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
            })).filter((i) => i.id);
            setCartItems(items);
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      } else {
        // --- GUEST USER LOGIC ---
        const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCartItems(localCart);
      }
    };

    fetchCart();
  }, [token]);

  // Total price logic
  useEffect(() => {
    const total = cartItems.reduce((t, i) => t + i.price * i.qty, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Sync state with LocalStorage for guests
  const updateCartState = (updatedItems) => {
    setCartItems(updatedItems);
    if (!token) {
      localStorage.setItem("guestCart", JSON.stringify(updatedItems));
    }
  };

  const increaseQty = async (id) => {
    if (token) {
      try {
        await axios.post(`${API_URL}/add-to-cart`, 
          { productId: id, quantity: 1 }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync increase to server", err);
      }
    }
    const updated = cartItems.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
    updateCartState(updated);
  };

  const decreaseQty = async (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item.qty <= 1) return;

    if (token) {
      try {
        // Assuming your backend handles negative quantity or you have a decrease endpoint
        // If your add-to-cart only adds, you might need a specific 'decrease' route
        await axios.post(`${API_URL}/add-to-cart`, 
          { productId: id, quantity: -1 }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync decrease to server", err);
      }
    }
    
    const updated = cartItems.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    updateCartState(updated);
  };

  const removeItem = async (id) => {
    if (token) {
      try {
        await axios.delete(`${API_URL}/cart/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Failed to remove item from server", err);
      }
    }
    const updated = cartItems.filter(i => i.id !== id);
    updateCartState(updated);
  };

  const handleCheckout = () => {
    if (!token) {
      // Send to login but remember they wanted to checkout
      navigate("/login?redirect=check-out");
    } else {
      navigate("/check-out");
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center your-cart-title"
        >
          🛒 Your Cart
        </motion.h2>
        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <motion.div 
                layout 
                key={item.id} 
                className="card p-3 shadow-sm border-0 rounded-4 mb-3"
              >
                <div className="row align-items-center">
                  <div className="col-md-3 text-center">
                    <img src={item.img} className="img-fluid rounded-4" alt={item.name} style={{ height: 100, width: 100, objectFit: "cover" }} />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-bold">{item.name}</h5>
                    <p className="fw-semibold mb-1">₹{item.price}</p>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <button className="btn btn-outline-dark btn-sm px-2" onClick={() => decreaseQty(item.id)}>−</button>
                      <span className="px-3 fw-bold">{item.qty}</span>
                      <button className="btn btn-outline-dark btn-sm px-2" onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <button className="btn btn-danger btn-sm rounded-circle" onClick={() => removeItem(item.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {cartItems.length === 0 && (
              <div className="text-center py-5">
                <h4 className="text-muted">Your cart is empty!</h4>
                <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>Go Shopping</button>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card p-4 shadow-lg border-0 rounded-4 sticky-top" style={{ top: "100px" }}>
              <h4 className="fw-bold mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total:</h5>
                <h5 className="fw-bold">₹{totalPrice}</h5>
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn btn-dark w-100 py-2 rounded-4 fw-semibold"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;