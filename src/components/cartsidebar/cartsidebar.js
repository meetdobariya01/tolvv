import React, { useState, useEffect, useCallback } from "react";
import { Offcanvas } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cartsidebar.css";

const API_URL = process.env.REACT_APP_API_URL;

const CartSidebar = ({ show, handleClose }) => {
  const navigate = useNavigate();
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const zodiacColors = {
    Aries: "#7A1318",
    Taurus: "#7A8B3D",
    Gemini: "#BB892C",
    Cancer: "#8A8C8E",
    Leo: "#E8C43A",
    Virgo: "#DC4D2D",
    Libra: "#F04E4C",
    Scorpio: "#000000",
    Sagittarius: "#74489D",
    Capricorn: "#CCC29F",
    Aquarius: "#519AA2",
    Pisces: "#043D5D",
  };

  const token = localStorage.getItem("token");

  const getZodiacFromProduct = (name) => {
    if (!name) return null;
    return Object.keys(zodiacColors).find((zodiac) =>
      name.toLowerCase().includes(zodiac.toLowerCase())
    );
  };

  const getImageUrl = (photo) => {
    if (!photo) return "/images/default.jpg";
    if (Array.isArray(photo)) photo = photo[0];
    if (typeof photo !== "string") return "/images/default.jpg";
    return photo.startsWith("http")
      ? photo
      : `/images/${photo.replace("images/", "")}`;
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const res = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawItems = res.data?.cart?.items?.map((item) => {
          // Handle regular products
          if (item.productId && item.productId._id) {
            return {
              id: item.productId._id,
              name: item.productId.ProductName,
              price: item.productId.ProductPrice || 0,
              qty: item.quantity || 1,
              img: getImageUrl(item.productId.Photos),
              category: item.productId.Category,
              type: "product",
              zodiac: item.productId.Zodiac,
              cartItemId: item._id,
            };
          }
          // Handle hampers (both custom and zodiac)
          if (item.hamperId && item.hamperId._id) {
            const isCustomHamper = item.hamperId.products && item.hamperId.products.length > 0;

            return {
              id: item.hamperId._id,
              name: isCustomHamper ? "Custom Hamper" : (item.hamperId.ProductName || "Zodiac Hamper"),
              price: item.hamperId.totalPrice || item.hamperId.ProductPrice || 0,
              qty: item.quantity || 1,
              img: isCustomHamper ? "/images/hamper.jpg" : getImageUrl(item.hamperId.Photos),
              category: "Hamper",
              type: "hamper",
              hamperProducts: item.hamperId.products || [],
              hamperZodiac: item.hamperId.zodiacs || [],
              isCustomHamper: isCustomHamper,
              cartItemId: item._id,
            };
          }
          return {
            id: item._id || Math.random(),
            name: "Unknown Item",
            price: 0,
            qty: item.quantity || 1,
            img: "/images/product-grid.png",
            category: "Unknown",
            type: "unknown",
            cartItemId: item._id,
          };
        }) || [];

        const items = rawItems.flat();
        const uniqueItems = items.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.cartItemId === item.cartItemId)
        );

        setCartItems(uniqueItems);
        setTotalPrice(
          uniqueItems.reduce((s, i) => s + (i?.price || 0) * (i?.qty || 0), 0)
        );

        if (uniqueItems.length > 0) fetchRelatedProducts(uniqueItems);
      } else {
        // Guest cart
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const formatted = await Promise.all(
          guestCart.map(async (item, index) => {
            // Handle regular products
            if (item.productId && !item.type) {
              try {
                const res = await axios.get(`${API_URL}/products/${item.productId}`);
                return {
                  id: item.productId,
                  name: res.data.ProductName || "Product",
                  price: res.data.ProductPrice || 0,
                  qty: item.quantity || 1,
                  img: getImageUrl(res.data.Photos),
                  category: res.data.Category,
                  type: "product",
                  zodiac: res.data.Zodiac,
                  cartItemId: `guest-${item.productId}`,
                };
              } catch {
                return {
                  id: item.productId,
                  name: "Product",
                  price: item.price || 0,
                  qty: item.quantity || 1,
                  img: getImageUrl(null),
                  category: "Unknown",
                  type: "product",
                  cartItemId: `guest-${item.productId}`,
                };
              }
            }
            // Handle hampers (both custom and zodiac)
            if (item.type === "hamper" || item.hamperData) {
              const isCustomHamper = item.hamperData || (item.hamperProducts && item.hamperProducts.length > 0);

              return {
                id: item.id || `hamper-${index}`,
                name: isCustomHamper ? "Custom Hamper" : (item.name || "Zodiac Hamper"),
                price: item.price || item.hamperData?.totalPrice || 0,
                qty: item.quantity || 1,
                img: item.img || "/images/hamper.jpg",
                category: "Hamper",
                type: "hamper",
                hamperProducts: item.hamperProducts || item.hamperData?.products || [],
                hamperZodiac: item.hamperData?.zodiacs || [],
                isCustomHamper: !!isCustomHamper,
                cartItemId: item.id || `hamper-${index}`,
              };
            }
            return null;
          })
        );
        const cleanItems = formatted.filter(Boolean);
        setCartItems(cleanItems);
        setTotalPrice(cleanItems.reduce((s, i) => s + i.price * i.qty, 0));
        if (cleanItems.length > 0) fetchRelatedProducts(cleanItems);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
      setTotalPrice(0);
    }
    setLoading(false);
  }, [token]);

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

  const increaseQty = async (id, type = "product") => {
    setUpdatingId(id);
    try {
      if (token) {
        if (type === "product") {
          await axios.post(
            `${API_URL}/cart/add`,
            { productId: id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            `${API_URL}/cart/add-hamper`,
            { hamperId: id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } else {
        const updatedItems = cartItems.map((i) =>
          i.id === id ? { ...i, qty: i.qty + 1 } : i
        );
        updateGuestCart(updatedItems);
      }
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQty = async (id, type = "product") => {
    const item = cartItems.find(i => i.id === id);
    if (item.qty <= 1) {
      removeItem(id, type);
      return;
    }
    setUpdatingId(id);
    try {
      if (token) {
        if (type === "product") {
          await axios.post(
            `${API_URL}/cart/add`,
            { productId: id, quantity: -1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            `${API_URL}/cart/add-hamper`,
            { hamperId: id, quantity: -1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } else {
        const updatedItems = cartItems.map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        );
        updateGuestCart(updatedItems);
      }
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateGuestCart = (updatedItems) => {
    setCartItems(updatedItems);
    const existing = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const merged = updatedItems.map((i) => {
      if (i.type === "hamper") {
        const old = existing.find(e => e.id === i.id);
        return old ? {
          ...old,
          quantity: i.qty,
          price: i.price,
        } : {
          id: i.id,
          type: "hamper",
          hamperData: {},
          hamperProducts: i.hamperProducts || [],
          quantity: i.qty,
          price: i.price,
          name: i.name,
          img: i.img,
        };
      }
      return {
        productId: i.id,
        quantity: i.qty,
        price: i.price,
      };
    });
    localStorage.setItem("guestCart", JSON.stringify(merged));
    setTotalPrice(updatedItems.reduce((s, i) => s + i.price * i.qty, 0));
  };

  const removeItem = async (id, type = "product") => {
    setUpdatingId(id);
    try {
      if (token) {
        const cartItem = cartItems.find(item => item.id === id);

        if (cartItem && cartItem.cartItemId) {
          await axios.delete(`${API_URL}/cart/remove/${cartItem.cartItemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        await fetchCart();
      } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        guestCart = guestCart.filter((i) => {
          if (i.type === "hamper") return i.id !== id;
          return i.productId !== id;
        });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        await fetchCart();
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const checkDelivery = () => {
    if (!country || !city || !zip) {
      setDeliveryMsg("Please enter your shipping details.");
    } else {
      setDeliveryMsg("Estimated delivery: Your order will arrive within 5–7 business days.");
    }
  };

  const handleCheckoutClick = () => {
    handleClose();
    if (token) {
      navigate("/Check-out");
    } else {
      navigate("/login", { state: { from: "/Check-out" } });
    }
  };

  const handleContinueShopping = () => {
    handleClose();
    navigate("/product");
  };

  const addToCart = async (product) => {
    if (!product) return;
    try {
      if (token) {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingItem = guestCart.find((i) => i.productId === product._id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            quantity: 1,
            price: product.ProductPrice,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ✅ NEW: Navigate to product details page (closes sidebar first)
  const goToProductDetail = (productId) => {
    handleClose(); // Close the cart sidebar
    navigate(`/productdetails/${productId}`); // Navigate to product details page
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const getFilteredBestSellers = () => {
    const cartProductIds = cartItems.map(item => item.id);
    const filtered = bestSellers.filter(product =>
      !cartProductIds.includes(product._id)
    );
    return filtered;
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const currentCategory = cartItems.length > 0
          ? cartItems[cartItems.length - 1].category
          : "Zodiac";

        const excludeIds = cartItems.map(item => item.id).filter(Boolean).join(",");

        let url = `${API_URL}/products/best-sellers?category=${encodeURIComponent(currentCategory)}`;
        if (excludeIds) url += `&exclude=${excludeIds}`;

        const res = await axios.get(url);
        setBestSellers(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching filtered best sellers:", err);
      }
    };

    if (show) {
      fetchBestSellers();
    }
  }, [cartItems, show]);

  if (loading) {
    return (
      <Offcanvas show={show} onHide={handleClose} placement="end" className="cart-sidebar sora">
        <Offcanvas.Header>
          <Offcanvas.Title>CART</Offcanvas.Title>
          <span className="close-btn-1 ms-auto" onClick={handleClose}>×</span>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Loading...
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  const visibleBestSellers = getFilteredBestSellers();

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end" className="cart-sidebar sora">
        <Offcanvas.Header>
          <Offcanvas.Title>CART ({cartItems.length})</Offcanvas.Title>
          <span className="close-btn-1 ms-auto" onClick={handleClose}>×</span>
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
              <div key={item.id} className="cart-item-1">
                <img src={item.img} alt={item.name} className="cart-img" />
                <div className="cart-details">
                  <p className="cart-name">{item.name}</p>

                  {/* Show zodiac dot for products */}
                  {item.type === "product" && item.zodiac && (
                    <div className="d-flex align-items-center gap-1 mt-1">
                      {/* <span
                        className="zodiac-dot"
                        style={{
                          backgroundColor: zodiacColors[item.zodiac] || "#CCC29F",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      ></span> */}
                      {/* <small style={{ fontSize: "10px", color: "#666" }}>{item.zodiac}</small> */}
                    </div>
                  )}

                  <div className="qty-box mt-2">
                    <button onClick={() => decreaseQty(item.id, item.type)} disabled={updatingId === item.id}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id, item.type)} disabled={updatingId === item.id}>+</button>
                  </div>

                  {/* Show hamper products for custom hampers */}
                  {item.type === "hamper" && item.hamperProducts && item.hamperProducts.length > 0 && (
                    <div style={{ marginTop: "8px", paddingLeft: "10px" }}>
                      <small style={{ fontSize: "11px", color: "#888", fontWeight: "500" }}>Includes:</small>
                      {item.hamperProducts.map((hp, idx) => (
                        <p key={idx} style={{ fontSize: "10px", color: "#666", marginBottom: "3px" }}>
                          • {hp.productId?.ProductName || hp.name} x {hp.quantity}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Show zodiac for zodiac hampers */}
                  {item.type === "hamper" && item.hamperZodiac && item.hamperZodiac.length > 0 && !item.isCustomHamper && (
                    <div style={{ marginTop: "5px" }}>
                      <small style={{ fontSize: "10px", color: "#666" }}>
                        Zodiac: {item.hamperZodiac.join(", ")}
                      </small>
                    </div>
                  )}
                </div>
                <div className="cart-price">
                  ₹{item.price * item.qty}
                  <FiTrash2
                    className="delete-icon"
                    onClick={() => removeItem(item.id, item.type)}
                    style={{ opacity: updatingId === item.id ? 0.5 : 1, cursor: 'pointer' }}
                  />
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              <hr />
              <div className="shipping-box mt-5">
                <p className="shipping-title">Estimate shipping</p>
                <div className="shipping-inputs d-flex flex-row gap-2">
                  <input placeholder="Country" className="w-25" value={country} onChange={(e) => setCountry(e.target.value)} />
                  <input placeholder="City" className="w-25" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input placeholder="Postal/ZIP Code" className="w-25" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
                <button className="check-btn" onClick={checkDelivery}>CHECK DELIVERY TIME</button>
                {deliveryMsg && <p className="delivery-msg mt-2">{deliveryMsg}</p>}
              </div>
              <hr />
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
                  <button className="checkout-btn w-auto" onClick={handleCheckoutClick}>CHECKOUT</button>
                </div>
              </div>
            </>
          )}

          {/* Best Sellers Section */}
          {visibleBestSellers.length > 0 && (
            <section className="product-section-1 mt-5">
              <Container>
                <Row className="g-1">
                  <h5>Best Sellers</h5>
                  {visibleBestSellers.map((product, index) => (
                    <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
                      <motion.div
                        className="product-card-cart p-1"
                        whileHover={{ y: -10 }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => goToProductDetail(product._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="product-img-box">
                          <img src={getImageUrl(product.Photos)} alt={product.ProductName} />
                        </div>
                        <div className="product-info">
                          <h6 className="d-flex align-items-center gap-2">
                            <span
                              className="planet-dot"
                              style={{
                                backgroundColor: zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
                              }}
                            ></span>
                            {product.ProductName}
                          </h6>
                          <div className="divider"></div>
                          <div className="product-meta">
                            <span>{product.size || ""}</span>
                            <span className="price">₹ {product.ProductPrice}</span>
                          </div>
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="product-section-1 mt-5">
              <Container>
                <Row className="g-1">
                  <h5>You may also like</h5>
                  {relatedProducts.map((product, index) => (
                    <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
                      <motion.div
                        className="product-card-cart p-1"
                        whileHover={{ y: -10 }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => goToProductDetail(product._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="product-img-box">
                          <img src={getImageUrl(product.Photos)} alt={product.ProductName} />
                        </div>
                        <div className="product-info">
                          <h6 className="d-flex align-items-center gap-2">
                            <span
                              className="planet-dot"
                              style={{
                                backgroundColor: zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
                              }}
                            ></span>
                            {product.ProductName}
                          </h6>
                          <div className="divider"></div>
                          <div className="product-meta">
                            <span className="size">{product.size || ""}</span>
                            <span className="price">₹ {product.ProductPrice}</span>
                          </div>
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-detail-modal" onClick={closeProductDetail}>
          <div className="product-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeProductDetail}>×</button>
            <div className="modal-product-img">
              <img src={getImageUrl(selectedProduct.Photos)} alt={selectedProduct.ProductName} />
            </div>
            <div className="modal-product-info">
              <h2>{selectedProduct.ProductName}</h2>
              <p className="modal-category">Category: {selectedProduct.Category}</p>
              <p className="modal-zodiac">
                <span
                  className="zodiac-dot"
                  style={{ backgroundColor: zodiacColors[getZodiacFromProduct(selectedProduct.ProductName)] || "#000" }}
                ></span>
                {getZodiacFromProduct(selectedProduct.ProductName) || "Universal"}
              </p>
              <p className="modal-price">₹ {selectedProduct.ProductPrice}</p>
              <p className="modal-description">
                {selectedProduct.Description || "This premium product is crafted with care using high-quality ingredients to provide the best experience."}
              </p>
              <button
                className="modal-add-btn"
                onClick={() => {
                  addToCart(selectedProduct);
                  closeProductDetail();
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;