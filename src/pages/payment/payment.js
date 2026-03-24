import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);

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
        Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 2 });
      }
      alert("✅ Product added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };
  
  useEffect(() => {
    if (bestSellers.length > 0) {
      setRelatedProducts(bestSellers.slice(0, 4));
    }
  }, [bestSellers]);
  
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/best-sellers`);
        if (res.data.length > 0) {
          setBestSellers(res.data);
        } else {
          const allProducts = await axios.get(`${API_URL}/products`);
          setBestSellers(allProducts.data.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);
  
  if (loading) {
    return (
      <div>
        <Header />
        <div className="payment-page">
          <div style={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div>
      <Header />
      <div className="payment-page">
        <div className="thankyou-container sora">
          <div className="row g-0 h-100">
            <div className="col-md-7 left-panel d-flex flex-column justify-content-center align-items-center">
              <h1 className="thank-text artisan-font">Thank You</h1>
              <NavLink to="/" className="back-link mt-5 d-flex align-items-end">
                Go back to shopping <span>›</span>
              </NavLink>
            </div>
            <div className="col-md-5 right-panel d-flex justify-content-center align-items-center">
              <div className="success-box text-center">
                <div className="check-icon">
                  <img
                    src="./images/check-circle.png"
                    alt="success"
                    className="check-img"
                  />
                </div>
                <h6 className="title mt-5">PAYMENT SUCCESSFUL</h6>
                <p className="desc mt-4 mb-1">
                  Your order is on its way to a little moment of indulgence.
                </p>
                <p className="desc mt-4">
                  Get ready to unwrap self-care, <br /> crafted just for you.
                </p>
                <NavLink to="/profile" className="view-order mt-5">
                  Order received. View your order <span>›</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
                            backgroundColor: zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
                          }}
                        ></span>
                        {product.ProductName}
                      </h6>
                      <div className="product-meta">
                        <span>{product.size || ""}</span>
                        <span className="price">₹ {product.ProductPrice}</span>
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
      
      <Footer />
    </div>
  );
};

export default Payment;