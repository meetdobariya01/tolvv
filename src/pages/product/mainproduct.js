import React, { useState, useEffect } from "react";
import { Accordion, Card, Button, Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./mainproduct.css";
const API_URL = process.env.REACT_APP_API_URL;

const Mainproduct = () => {
  const [activeKey, setActiveKey] = useState("Bath Gel");
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

  const categories = [
    "Bath Gel",
    "Soap",
    "Perfume",
    "Essential Oil",
    "Body Lotion",
    "Hamper",
  ];
  const products = [
    { title: "Bath Gel", size: "200 ml", img: "/images/bl.png" },
    { title: "Body Lotion", size: "200 ml", img: "/images/bb.png" },
    { title: "Perfume", size: "50 ml", img: "/images/pr.png" },
    { title: "Essential Oil", size: "30 ml", img: "/images/eo.png" },
    { title: "Soap", size: "100 gsm", img: "/images/sp.png" },
    { title: "Hampers", size: "", img: "/images/hamper.jpg" },
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const data = res.data;

        const grouped = {};
        categories.forEach((cat) => (grouped[cat] = []));

        data.forEach((prod) => {
          const category = prod.Category?.trim();
          if (grouped[category]) {
            if (!grouped[category].find((p) => p._id === prod._id)) {
              grouped[category].push(prod);
            }
          }
        });

        setProductsByCategory(grouped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = async (productId) => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/add-to-cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div>
      <Header />

      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            CELESTIAL
            <br />
            CARE
          </h1>

          <p className="hero-subtitle">
            Crafted for your
            <br />
            skin’s glow.
          </p>

          <p className="hero-desc">
            Explore products from bath gels to essential oils & candles
          </p>
        </div>
      </section>

      <div className="container py-5">
        {/* CATEGORY NAVBAR */}
        {/* <div className="category-navbar mb-4">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`category-btn ${activeKey === cat ? "active" : ""}`}
              onClick={() => setActiveKey(cat)}
            >
              {cat}
            </button>
          ))}
        </div> */}

        <section className="products-section-grid">
          <Container>
            <Row className="gx-4 gy-3 mb-5">
              {products.map((item, index) => (
                <Col
                  key={index}
                  xs={4} // ✅ MOBILE → 2 ITEMS
                  sm={6}
                  md={4}
                  lg={2}
                >
                  <div className="product-card">
                    <div className="product-img-card">
                      <img src={item.img} alt={item.title} />
                    </div>

                    <div className="product-info-collection">
                      <h5>
                        {item.title} <span>›</span>
                      </h5>
                      <div className="underline" />
                      <p>{item.size}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <hr />

        {/* PRODUCT GRID */}
        <div className="row product-fade mt-4">
          <h2 className="products-page-heading text-center the-artisan-font">Products Name</h2>
          {productsByCategory[activeKey]?.map((item) => (
            <div
              className="col-6 col-md-3 mb-4 product-card-animate"
              key={item._id}
            >
              <Card className="product-card">
                <div className="product-img-wrap">
                  <Card.Img
                    src={
                      item.Photos
                        ? item.Photos.startsWith("http")
                          ? item.Photos
                          : `/images/${item.Photos.replace("images/", "")}`
                        : "/images/default.jpg"
                    }
                  />
                </div>

                <Card.Body className="product-info">
                  <div className="product-top">
                    <div className="title-wrap">
                      <h6 className="product-title">
                        {item.ProductName} <span className="arrow">›</span>
                      </h6>
                      <p className="product-size">{item.size}</p>
                    </div>

                    <div className="price-wrap">
                      {/* <span className="price-dot"></span> */}
                      <span className="product-price">
                        ₹ {item.ProductPrice}
                      </span>
                    </div>
                  </div>

                  <div className="product-divider"></div>

                  <NavLink
                    to={`/productdetails`}
                    className="text-decoration-none"
                  >
                    <Button size="sm" className="cart-btn w-50">
                      ADD TO CART
                    </Button>
                  </NavLink>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mainproduct;
