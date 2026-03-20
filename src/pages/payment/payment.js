import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const Payment = () => {


  const [relatedProducts, setRelatedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const getImageUrl = (photo) => {
    if (!photo) return "/images/product-grid.png";
    if (photo.startsWith("http")) return photo;
    return `/${photo.replace(/^\/+/, "")}`;
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
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);

        // 👉 simple fallback (no cart here)
        setRelatedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Related products error:", err);
      }
    };

    fetchRelatedProducts();
  }, []);
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

      // ✅ SUCCESS ALERT
      alert("✅ Product added to cart successfully!");

    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };
  return (
    <div>
      {/* Header section*/}
      <Header />
      <div className="payment-page">
        <div className="thankyou-container sora">
          <div className="row g-0 h-100">
            {/* LEFT SIDE */}
            <div className="col-md-7 left-panel d-flex flex-column justify-content-center align-items-center">
              <h1 className="thank-text artisan-font">Thank You</h1>

              {/* <div className="line"></div> */}

              <NavLink 
                  to="/products"
               className="back-link mt-5 d-flex align-items-end text-light text-decoration-none">
                Go back to shopping <span>›</span>
              </NavLink>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-5 right-panel d-flex justify-content-center align-items-center">
              <div className="success-box text-center">
                {/* CHECK ICON */}
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

                <p className="view-order mt-5">
                  Order received. View your order <span>›</span>
                </p>
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
                      <h6>{product.ProductName}</h6>

                      <div className="product-meta">
                        <span className="size">{product.size || ""}</span>
                        <span className="price">
                          <span className="dot"></span> ₹ {product.ProductPrice}
                        </span>
                      </div>

                      <div className="divider"></div>

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
                      <h6>{product.ProductName}</h6>

                      <div className="product-meta">
                        <span>{product.size || ""}</span>

                        <span className="price">
                          <span className="dot"></span> ₹ {product.ProductPrice}
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

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Payment;