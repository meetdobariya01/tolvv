// import React from "react";
// import "./payment.css";
// import { NavLink } from "react-router-dom";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import { Container, Row, Col } from "react-bootstrap";
// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// const Payment = () => {
//   const API_URL = process.env.REACT_APP_API_URL;
//   const navigate = useNavigate();
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bestSellers, setBestSellers] = useState([]);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const method = queryParams.get("method");
//   const zodiacColors = {
//     Aries: "#7A1318",
//     Taurus: "#7A8B3D",
//     Gemini: "#BB892C",
//     Cancer: "#8A8C8E",
//     Leo: "#E8C43A",
//     Virgo: "#DC4D2D",
//     Libra: "#F04E4C",
//     Scorpio: "#000000",
//     Sagittarius: "#74489D",
//     Capricorn: "#CCC29F",
//     Aquarius: "#519AA2",
//     Pisces: "#043D5D",
//   };

//   const getZodiacFromProduct = (name) => {
//     if (!name) return null;
//     return Object.keys(zodiacColors).find((zodiac) =>
//       name.toLowerCase().includes(zodiac.toLowerCase())
//     );
//   };

//   const getImageUrl = (photo) => {
//     if (!photo) return "/images/default.jpg";
//     if (Array.isArray(photo)) photo = photo[0];
//     if (typeof photo !== "string") return "/images/default.jpg";
//     return photo.startsWith("http")
//       ? photo
//       : `/images/${photo.replace("images/", "")}`;
//   };

//   const addToCart = async (product) => {
//     if (!product) return;
//     const token = localStorage.getItem("token");
//     try {
//       if (token) {
//         await axios.post(
//           `${API_URL}/cart/add`,
//           { productId: product._id, quantity: 1 },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");
//         const existingItem = guestCart.find((i) => i.productId === product._id);
//         if (existingItem) {
//           existingItem.quantity += 1;
//         } else {
//           guestCart.push({
//             productId: product._id,
//             quantity: 1,
//             price: product.ProductPrice,
//           });
//         }
//         Cookies.set("guestCart", JSON.stringify(guestCart), { expires: 2 });
//       }
//       alert("✅ Product added to cart");
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.error("Add to cart error:", error);
//     }
//   };

//   useEffect(() => {
//     if (bestSellers.length > 0) {
//       setRelatedProducts(bestSellers.slice(0, 4));
//     }
//   }, [bestSellers]);

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/products/best-sellers`);
//         if (res.data.length > 0) {
//           setBestSellers(res.data);
//         } else {
//           const allProducts = await axios.get(`${API_URL}/products`);
//           setBestSellers(allProducts.data.slice(0, 4));
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBestSellers();
//   }, []);

//   if (loading) {
//     return (
//       <div>
//         <Header />
//         <div className="payment-page">
//           <div style={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//             Loading...
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <div className="payment-page">
//         <div className="thankyou-container sora">
//           <div className="row g-0 h-100">
//             <div className="col-md-7 left-panel d-flex flex-column justify-content-center align-items-center">
//               <h1 className="thank-text artisan-font">Thank You</h1>
//               <NavLink to="/" className="back-link mt-5 d-flex align-items-end text-light text-decoration-none">
//                 Go back to shopping <span>›</span>
//               </NavLink>
//             </div>
//             <div className="col-md-5 right-panel d-flex justify-content-center align-items-center">
//               <div className="success-box text-center">
//                 <div className="check-icon">
//                   <img
//                     src="./images/check-circle.png"
//                     alt="success"
//                     className="check-img"
//                   />
//                 </div>
//                 <h6 className="title mt-5">
//                   {method === "cod" ? "ORDER CONFIRMED" : "PAYMENT SUCCESSFUL"}
//                 </h6>
//                 <p className="desc mt-4 mb-1">
//                   {method === "cod"
//                     ? "Your order has been placed successfully."
//                     : "Your order is on its way to a little moment of indulgence."}
//                 </p>
//                 <p className="desc mt-4">
//                   {method === "cod"
//                     ? "You can pay in cash when your order arrives."
//                     : "Get ready to unwrap self-care, crafted just for you."}
//                 </p>
//                 <NavLink to="/profile" className="view-order mt-5 text-decoration-none">
//                   Order received. View your order <span>›</span>
//                 </NavLink>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {relatedProducts.length > 0 && (
//         <section className="product-section-1 mt-5 sora">
//           <Container>
//             <Row className="g-1">
//               <h5>You may also like</h5>
//               {relatedProducts.map((product, index) => (
//                 <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
//                   <motion.div
//                     className="product-card p-1"
//                     whileHover={{ y: -10 }}
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: index * 0.1 }}
//                   >
//                     <div className="product-img-box">
//                       <img
//                         src={getImageUrl(product.Photos)}
//                         alt={product.ProductName}
//                       />
//                     </div>
//                     <div className="product-info">
//                       <h6 className="d-flex align-items-center gap-2">
//                         <span
//                           className="zodiac-dot"
//                           style={{
//                             backgroundColor:
//                               zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
//                           }}
//                         ></span>
//                         <span className="fw-bolder">
//                           {product.ProductName} <span>›</span>
//                         </span>
//                       </h6>
//                       <div className="divider"></div>
//                       <div className="product-meta">
//                         <span className="size">{product.size || ""}</span>
//                         <span className="price">₹ {product.ProductPrice}</span>
//                       </div>
//                       <button
//                         className="add-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           addToCart(product);
//                         }}
//                       >
//                         ADD TO CART
//                       </button>
//                     </div>
//                   </motion.div>
//                 </Col>
//               ))}
//             </Row>
//           </Container>
//         </section>
//       )}

//       {bestSellers.length > 0 && (
//         <section className="product-section-1 mt-5 sora">
//           <Container>
//             <Row className="g-1">
//               <h5>Best Sellers</h5>
//               {bestSellers.map((product, index) => (
//                 <Col lg={3} md={6} sm={6} xs={6} key={product._id}>
//                   <motion.div
//                     className="product-card p-1"
//                     whileHover={{ y: -10 }}
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: index * 0.1 }}
//                   >
//                     <div className="product-img-box">
//                       <img
//                         src={getImageUrl(product.Photos)}
//                         alt={product.ProductName}
//                       />
//                     </div>
//                     <div className="product-info">
//                       <h6 className="d-flex align-items-center gap-2">
//                         <span
//                           className="zodiac-dot"
//                           style={{
//                             backgroundColor: zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
//                           }}
//                         ></span>
//                         {product.ProductName}
//                       </h6>
//                       <div className="product-meta">
//                         <span>{product.size || ""}</span>
//                         <span className="price">₹ {product.ProductPrice}</span>
//                       </div>
//                       <div className="divider"></div>
//                       <button
//                         className="add-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           addToCart(product);
//                         }}
//                       >
//                         ADD TO CART
//                       </button>
//                     </div>
//                   </motion.div>
//                 </Col>
//               ))}
//             </Row>
//           </Container>
//         </section>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Payment;

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
import { useLocation } from "react-router-dom";

const Payment = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const method = queryParams.get("method");
  const orderId = queryParams.get("orderId");
  const type = queryParams.get("type");
  const remainingAmount = queryParams.get("remaining");
  const error = queryParams.get("error");
  const errorMessage = queryParams.get("message");
  
  // Check if this is a failed payment page
  const isFailedPage = location.pathname === "/payment-failed" || error === "payment_failed";
  
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

  // Determine what to display based on payment type and status
  const getPaymentDisplay = () => {
    // Handle failed payment
    if (isFailedPage) {
      return {
        isSuccess: false,
        title: "PAYMENT FAILED",
        mainMessage: "We couldn't process your payment.",
        subMessage: errorMessage ? decodeURIComponent(errorMessage) : "Please try again or choose a different payment method.",
        instruction: "Your order has not been placed. Please try again.",
        buttonText: "Try Again",
        buttonLink: "/checkout",
        showRemaining: false
      };
    }

    // Handle hybrid COD success
    if (type === "hybrid-cod") {
      return {
        isSuccess: true,
        title: "PARTIAL PAYMENT SUCCESSFUL",
        mainMessage: `You have successfully paid ₹200 online for your order.`,
        subMessage: `Please pay the remaining ₹${remainingAmount || '0'} in cash when your order is delivered.`,
        instruction: "Your order will be processed and shipped soon.",
        buttonText: "View Order",
        buttonLink: `/profile?orderId=${orderId}`,
        showRemaining: true,
        remainingAmount: remainingAmount
      };
    } 
    
    // Handle regular COD success
    if (method === "cod") {
      return {
        isSuccess: true,
        title: "ORDER CONFIRMED",
        mainMessage: "Your order has been placed successfully.",
        subMessage: "You can pay in cash when your order arrives.",
        instruction: "Get ready to unwrap self-care, crafted just for you.",
        buttonText: "View Order",
        buttonLink: `/profile?orderId=${orderId}`,
        showRemaining: false
      };
    }
    
    // Handle regular payment success
    if (!isFailedPage && !error) {
      return {
        isSuccess: true,
        title: "PAYMENT SUCCESSFUL",
        mainMessage: "Your payment has been processed successfully.",
        subMessage: "Your order is on its way to a little moment of indulgence.",
        instruction: "Get ready to unwrap self-care, crafted just for you.",
        buttonText: "View Order",
        buttonLink: `/profile?orderId=${orderId}`,
        showRemaining: false
      };
    }

    // Default fallback
    return {
      isSuccess: false,
      title: "PAYMENT STATUS UNKNOWN",
      mainMessage: "We're not sure what happened with your payment.",
      subMessage: "Please check your order status in your profile or contact support.",
      instruction: "If you were charged, the amount will be refunded within 5-7 business days.",
      buttonText: "Go to Profile",
      buttonLink: "/profile",
      showRemaining: false
    };
  };

  const display = getPaymentDisplay();

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
              <h1 className="thank-text artisan-font">
                {display.isSuccess ? "Thank You" : "Oops!"}
              </h1>
              <NavLink to="/" className="back-link mt-5 d-flex align-items-end text-light text-decoration-none">
                Go back to shopping <span>›</span>
              </NavLink>
            </div>
            <div className="col-md-5 right-panel d-flex justify-content-center align-items-center">
              <div className="success-box text-center">
                <div className="check-icon">
                  <img
                    src={display.isSuccess ? "./images/check-circle.png" : "./images/error-circle.png"}
                    alt={display.isSuccess ? "success" : "failed"}
                    className="check-img"
                    onError={(e) => {
                      e.target.src = display.isSuccess 
                        ? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                        : "https://cdn-icons-png.flaticon.com/512/599/599499.png";
                    }}
                  />
                </div>
                <h6 className="title mt-5">{display.title}</h6>
                <p className="desc mt-4 mb-1">
                  {display.mainMessage}
                </p>
                <p className="desc mt-2">
                  {display.subMessage}
                </p>
                {display.showRemaining && (
                  <div className="remaining-amount mt-3 p-3" style={{ 
                    backgroundColor: "#f0f9ff", 
                    borderRadius: "8px",
                    border: "1px solid #7c3aed",
                    margin: "10px 0"
                  }}>
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      <strong>💰 Remaining to pay on delivery:</strong><br />
                      <span style={{ fontSize: "24px", color: "#7c3aed", fontWeight: "bold" }}>
                        ₹{display.remainingAmount}
                      </span>
                    </p>
                  </div>
                )}
                <p className="desc mt-2" style={{ fontSize: "12px", color: "#666" }}>
                  {display.instruction}
                </p>
                <NavLink to={display.buttonLink} className="view-order mt-5 text-decoration-none">
                  {display.buttonText} <span>›</span>
                </NavLink>
                {!display.isSuccess && (
                  <NavLink to="/checkout" className="view-order mt-3 text-decoration-none" style={{ display: "block", marginTop: "10px" }}>
                    Go to Checkout <span>›</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {display.isSuccess && relatedProducts.length > 0 && (
        <section className="product-section-1 mt-5 sora">
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
                          className="zodiac-dot"
                          style={{
                            backgroundColor:
                              zodiacColors[getZodiacFromProduct(product.ProductName)] || "#000",
                          }}
                        ></span>
                        <span className="fw-bolder">
                          {product.ProductName} <span>›</span>
                        </span>
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

      {display.isSuccess && bestSellers.length > 0 && (
        <section className="product-section-1 mt-5 sora">
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
                          className="zodiac-dot"
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