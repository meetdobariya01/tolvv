import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // -----------------------------
  // FETCH CART
  const fetchCart = useCallback(async () => {
    setLoading(true);

    // ✅ LOGGED IN USER
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
        setTotalPrice(
          items.reduce((sum, i) => sum + i.price * i.qty, 0)
        );
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartItems([]);
      }
    }

    // ✅ GUEST USER
    else {
      let guestCart = [];

      try {
        const stored = Cookies.get("guestCart");
        guestCart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(guestCart)) guestCart = [];
      } catch {
        guestCart = [];
      }

      const formatted = guestCart.map((item) => {
        const photo = item.img;

        return {
          id: item.productId,
          name: item.name || "Product",
          price: item.price || 0,
          qty: item.quantity || 1,
          img: photo
            ? photo.startsWith("http")
              ? photo
              : `${API_URL}${photo}`
            : `${API_URL}/images/product-grid.png`,
        };
      });

      setCartItems(formatted);
      setTotalPrice(
        formatted.reduce((sum, i) => sum + i.price * i.qty, 0)
      );
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // -----------------------------
  // UPDATE GUEST CART
  const updateGuestCart = (items) => {
    setCartItems(items);

    Cookies.set(
      "guestCart",
      JSON.stringify(
        items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          img: i.img.replace(API_URL, ""),
        }))
      ),
      { expires: 7 }
    );

    setTotalPrice(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  };

  // -----------------------------
  // QUANTITY HANDLERS
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

    const updated = cartItems.map((i) =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    );
    updateGuestCart(updated);
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

    const updated = cartItems.map((i) =>
      i.id === id ? { ...i, qty: i.qty - 1 } : i
    );
    updateGuestCart(updated);
  };

  // -----------------------------
  // REMOVE ITEM
  const removeItem = async (id) => {
    if (token) {
      await axios.delete(`${API_URL}/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      return;
    }

    const updated = cartItems.filter((i) => i.id !== id);
    updateGuestCart(updated);
  };

  // -----------------------------
  // CHECKOUT
  const handleCheckout = () => {
    if (!token) navigate("/login");
    else navigate("/Check-out");
  };

  // -----------------------------
  // UI
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        Loading...
      </div>
    );

  if (!cartItems.length)
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h4 className="text-muted mt-5">Your cart is empty</h4>
          <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">🛒 Your Shopping Cart</h2>

        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                className="card p-3 mb-3 border-0 shadow-sm rounded-4"
              >
                <div className="row align-items-center">
                  <div className="col-3">
                    <img
                      src={item.img}
                      className="img-fluid rounded"
                      alt={item.name}
                    />
                  </div>

                  <div className="col-6">
                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="text-muted">₹{item.price}</p>
                  </div>

                  <div className="col-3 text-end">
                    <div className="d-flex justify-content-end mb-2">
                      <button className="btn btn-sm btn-light" onClick={() => decreaseQty(item.id)}>
                        −
                      </button>
                      <span className="mx-2">{item.qty}</span>
                      <button className="btn btn-sm btn-light" onClick={() => increaseQty(item.id)}>
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card p-4 border-0 shadow-sm rounded-4">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between">
                <span>Total</span>
                <strong>₹{totalPrice}</strong>
              </div>
              <button className="btn btn-dark w-100 mt-4" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
