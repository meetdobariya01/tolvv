import React, { useState, useEffect, useCallback } from "react";
import { Offcanvas } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./cartsidebar.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const CartSidebar = ({ show, handleClose }) => { // Remove navigate from props
  const navigate = useNavigate(); // Get navigate function from hook
  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const zodiacColors = {
    Aries: "#c10230",
    Taurus: "#ae1857",
    Gemini: "#d79a2b",
    Cancer: "#85422b",
    Leo: "#4d5a31",
    Virgo: "#5f504d",
    Libra: "#7e622d",
    Scorpio: "#2d2a26",
    Sagittarius: "#490e67",
    Capricorn: "#726b54",
    Aquarius: "#005d63",
    Pisces: "#006098",
  };
  const token = localStorage.getItem("token");
  const getZodiacFromProduct = (name) => {
    if (!name) return null;
    return Object.keys(zodiacColors).find((zodiac) =>
      name.toLowerCase().includes(zodiac.toLowerCase())
    );
  };
  /* ---------------- IMAGE HELPER ---------------- */
  const getImageUrl = (photo) => {
    if (!photo) return "/images/product-grid.png";
    if (photo.startsWith("http")) return photo;
    return `/${photo.replace(/^\/+/, "")}`;
  };


  /* ---------------- FETCH CART ---------------- */
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        // Logged-in user
        const res = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items =
          res.data?.cart?.items?.map((item) => {
            // ✅ PRODUCT
            if (item.productId && item.productId._id) {
              return {
                id: item.productId._id,
                name: item.productId.ProductName,
                price: item.productId.ProductPrice || 0,
                qty: item.quantity || 1,
                img: getImageUrl(item.productId.Photos),
                category: item.productId.Category,
              };
            }

            // ✅ HAMPER
            if (item.hamperId && item.hamperId._id) {
              return {
                id: item.hamperId._id,
                name: "Custom Hamper",
                price: item.hamperId.totalPrice || 0,
                qty: item.quantity || 1,
                img: "/images/hamper.jpg",
                category: "Hamper",
              };
            }

            // ✅ FALLBACK (VERY IMPORTANT)
            return {
              id: item._id || Math.random(),
              name: "Unknown Item",
              price: 0,
              qty: item.quantity || 1,
              img: "/images/product-grid.png",
              category: "Unknown",
            };
          }) || [];

        setCartItems(items);
        setTotalPrice(
          items.reduce((s, i) => s + (i?.price || 0) * (i?.qty || 0), 0)
        );
        if (items.length > 0) fetchRelatedProducts(items);
      } else {
        // Guest user
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

        const formatted = await Promise.all(
          guestCart.map(async (item) => {
            try {
              const res = await axios.get(
                `${API_URL}/products/${item.productId}`
              );
              return {
                id: item.productId,
                name: res.data.ProductName || "Product",
                price: res.data.ProductPrice || 0,
                qty: item.quantity || 1,
                img: getImageUrl(res.data.Photos),
                category: res.data.Category,
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
          })
        );

        setCartItems(formatted);
        setTotalPrice(formatted.reduce((s, i) => s + i.price * i.qty, 0));
        if (formatted.length > 0) fetchRelatedProducts(formatted);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
      setTotalPrice(0);
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
      console.error("Related products fetch error:", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchCart();
    }
  }, [show, fetchCart]);

  /* ---------------- QUANTITY ---------------- */
  const increaseQty = async (id) => {
    setUpdatingId(id);
    try {
      if (token) {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const updatedItems = cartItems.map((i) =>
          i.id === id ? { ...i, qty: i.qty + 1 } : i
        );
        updateGuestCart(updatedItems);
      }

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));// ✅ trigger अपडेट // ✅ IMPORTANT
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQty = async (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item.qty <= 1) {
      removeItem(id);
      return;
    }

    setUpdatingId(id);
    try {
      if (token) {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: id, quantity: -1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const updatedItems = cartItems.map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        );
        updateGuestCart(updatedItems);
      }

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated")); // ✅ ADD THIS // ✅ IMPORTANT
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateGuestCart = (updatedItems) => {
    setCartItems(updatedItems);
    Cookies.set(
      "guestCart",
      JSON.stringify(
        updatedItems.map((i) => ({
          productId: i.id,
          quantity: i.qty,
          price: i.price,
        }))
      ),
      { expires: 2 }
    );
    setTotalPrice(updatedItems.reduce((s, i) => s + i.price * i.qty, 0));
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (id) => {
    setUpdatingId(id);
    try {
      if (token) {
        await axios.delete(`${API_URL}/cart/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update local state
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        setTotalPrice(updatedItems.reduce((s, i) => s + i.price * i.qty, 0));
        if (updatedItems.length === 0) {
          setRelatedProducts([]);
        }
      } else {
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");
        guestCart = guestCart.filter((i) => i.productId !== id);
        Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 7 });

        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        setTotalPrice(updatedItems.reduce((s, i) => s + i.price * i.qty, 0));
        if (updatedItems.length === 0) {
          setRelatedProducts([]);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
      fetchCart(); // Revert on error
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- DELIVERY CHECK ---------------- */
  const checkDelivery = () => {
    if (!country || !city || !zip) {
      setDeliveryMsg("Please enter your shipping details.");
    } else {
      setDeliveryMsg(
        "Estimated delivery: Your order will arrive within 5–7 business days."
      );
    }
  };

  /* ---------------- ADD RELATED PRODUCT ---------------- */
  // const addRelatedToCart = async (product) => {
  //   if (!product) return;

  //   setUpdatingId(product._id);
  //   try {
  //     if (token) {
  //       await axios.post(
  //         `${API_URL}/cart/add`,
  //         { productId: product._id, quantity: 1 },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //     } else {
  //       let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

  //       // Check if product already exists in cart
  //       const existingItem = guestCart.find(i => i.productId === product._id);
  //       if (existingItem) {
  //         existingItem.quantity += 1;
  //       } else {
  //         guestCart.push({
  //           productId: product._id,
  //           quantity: 1,
  //           price: product.ProductPrice,
  //         });
  //       }

  //       Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 2 });
  //     }
  //     // Refresh cart after adding
  //     await fetchCart();
  //   } catch (error) {
  //     console.error("Error adding related product:", error);
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // };

  /* ---------------- HANDLE CHECKOUT CLICK ---------------- */
  const handleCheckoutClick = () => {
    handleClose(); // Close the cart sidebar
    if (token) {
      navigate("/Check-out"); // Navigate to checkout
    } else {
      navigate("/login"); // Navigate to login
    }
  };

  /* ---------------- HANDLE CONTINUE SHOPPING ---------------- */
  const handleContinueShopping = () => {
    handleClose();
    navigate("/product");
  };
  const addToCart = async (product) => {
    if (!product) return;

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

        const existingItem = guestCart.find(
          (i) => i.productId === product._id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            quantity: 1,
            price: product.ProductPrice,
          });
        }

        Cookies.set("guestCart", JSON.stringify(guestCart), {
          expires: 2,
        });
      }

      // ✅ 🔥 THIS IS THE MAIN FIX
      await fetchCart();   // <-- refresh cart instantly

    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/best-sellers`);

        console.log("BEST SELLERS DATA 👉", res.data);

        if (res.data.length > 0) {
          setBestSellers(res.data);
        } else {
          // ✅ FALLBACK (IMPORTANT)
          const allProducts = await axios.get(`${API_URL}/products`);
          setBestSellers(allProducts.data.slice(0, 4));
        }

      } catch (err) {
        console.error("Best seller error:", err);
      }
    };

    fetchBestSellers();
  }, []);
  if (loading)

    return (
      <Offcanvas show={show} onHide={handleClose} placement="end" className="cart-sidebar sora">
        <Offcanvas.Header>
          <Offcanvas.Title>CART</Offcanvas.Title>
          <span className="close-btn-1 ms-auto" onClick={handleClose}>
            ×
          </span>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Loading...
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="cart-sidebar sora">
      <Offcanvas.Header>
        <Offcanvas.Title>CART ({cartItems.length})</Offcanvas.Title>
        <span className="close-btn-1 ms-auto" onClick={handleClose}>
          ×
        </span>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ overflowY: 'auto' }}>
        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Your cart is empty</p>
            <button
              onClick={handleContinueShopping}
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item-1" style={{ opacity: updatingId === item.id ? 0.7 : 1 }}>
              <img src={item.img} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <p className="cart-name">{item.name}</p>
                <div className="qty-box">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    disabled={updatingId === item.id}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    disabled={updatingId === item.id}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-price">
                ₹{item.price}
                <FiTrash2
                  className="delete-icon"
                  onClick={() => removeItem(item.id)}
                  style={{ opacity: updatingId === item.id ? 0.5 : 1, cursor: 'pointer' }}
                />
              </div>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <>
            <hr />

            {/* Estimate Shipping */}
            <div className="shipping-box mt-5">
              <p className="shipping-title ">Estimate shipping</p>
              <div className="shipping-inputs d-flex flex-row gap-2">
                <input
                  placeholder="Country"
                  className="w-25"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <input
                  placeholder="City"
                  className="w-25"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  placeholder="Postal/ZIP Code"
                  className="w-25"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
              <button className="check-btn" onClick={checkDelivery}>
                CHECK DELIVERY TIME
              </button>
              {deliveryMsg && <p className="delivery-msg mt-2">{deliveryMsg}</p>}
            </div>

            <hr />

            {/* Subtotal */}
            <div className="subtotal-box">
              <div className="subtotal-row">
                <span>Subtotal</span>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="subtotal-row">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="subtotal-row">
                <span><b>Total</b></span>
                <span><b>₹{totalPrice}</b></span>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="checkout-btn w-auto"
                  onClick={handleCheckoutClick} // Use the new handler
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </>
        )}

        {/* Related Products */}

        {relatedProducts.length > 0 && (
          <section className="product-section-1 mt-5">
            <Container>
              <Row className="g-1">
                <h5>You may also like</h5>

                {relatedProducts.map((product, index) => (
                  <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
                    <motion.div
                      className="product-card p-1"
                      whileHover={{ y: -10 }}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="product-img-box">
                        <img
                          src={getImageUrl(product.Photos)}
                          alt={product.ProductName}
                        />
                      </div>

                      <div className="product-info">
                        <h6 className="d-flex align-items-center gap-2">
                          <span
                            className="planet-dot"
                            style={{
                              backgroundColor:
                                zodiacColors[
                                getZodiacFromProduct(product.ProductName)
                                ] || "#000",
                            }}
                          ></span>

                          {product.ProductName}
                        </h6>
                        <div className="divider"></div>
                        <div className="product-meta">
                          <span className="size">{product.size || ""}</span>
                          <span className="price">
                           ₹ {product.ProductPrice}
                          </span>
                        </div>
                        {/* 
                        <div className="divider"></div> */}

                        <button
                          className="add-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // 🚨 VERY IMPORTANT (prevents navigation)
                            addToCart(product);
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}
        {bestSellers.length > 0 && (
          <section className="product-section-1 mt-5">
            <Container>
              <Row className="g-1">
                <h5>Best Sellers</h5>

                {bestSellers.map((product, index) => (
                  <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
                    <motion.div
                      className="product-card p-1"
                      whileHover={{ y: -10 }}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="product-img-box">
                        <img
                          src={getImageUrl(product.Photos)}
                          alt={product.ProductName}
                        />
                      </div>

                      <div className="product-info">
                        <h6 className="d-flex align-items-center gap-2">
                          <span
                            className="planet-dot"
                            style={{
                              backgroundColor:
                                zodiacColors[
                                getZodiacFromProduct(product.ProductName)
                                ] || "#000",
                            }}
                          ></span>

                          {product.ProductName}
                        </h6>

                        <div className="product-meta">
                          <span>{product.size || ""}</span>

                          <span className="price">
                            ₹ {product.ProductPrice}
                          </span>
                        </div>

                        <div className="divider"></div>

                        <button
                          className="add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;