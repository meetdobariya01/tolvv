import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import "./mainproduct.css";

const API_URL = process.env.REACT_APP_API_URL;

const Mainproduct = () => {
  const [activeKey, setActiveKey] = useState("Bath Gel");
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

  // ✅ Category cards (clickable)
  const products = [
    { title: "Bath Gel", size: "200 ml", img: "/images/bl.png", category: "Bath Gel" },
    { title: "Body Lotion", size: "200 ml", img: "/images/bb.png", category: "Body Lotion" },
    { title: "Perfume", size: "50 ml", img: "/images/pr.png", category: "Perfume" },
    { title: "Essential Oil", size: "30 ml", img: "/images/eo.png", category: "Essential Oil" },
    { title: "Soap", size: "100 gsm", img: "/images/sp.png", category: "Soap" },
    { title: "Hamper", size: "", img: "/images/hamper.jpg", category: "Hamper" },
  ];

  const categories = products.map((p) => p.category);

  const token = localStorage.getItem("token");

  // ✅ Fetch products from API
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
            grouped[category].push(prod);
          }
        });

        setProductsByCategory(grouped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Category click handler
  const handleCategoryClick = (category) => {
    setActiveKey(category);
    document
      .getElementById("product-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Header />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>CELESTIAL<br />CARE</h1>
          <p className="hero-subtitle">Crafted for your<br />skin’s glow.</p>
          <p className="hero-desc">Explore products from bath gels to essential oils</p>
        </div>
      </section>

      <div className="container py-5">
        {/* CATEGORY GRID */}
        <section className="products-section-grid">
          <Container>
            <Row className="gx-4 gy-3 mb-5">
              {products.map((item, index) => (
                <Col key={index} xs={4} sm={6} md={4} lg={2}>
                  <div
                    className="product-card"
                    onClick={() => handleCategoryClick(item.category)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-img-card">
                      <img src={item.img} alt={item.title} />
                    </div>
                    <div className="product-info-collection">
                      <h5>{item.title} <span>›</span></h5>
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
        <div id="product-grid" className="row product-fade mt-4">
          <h2 className="products-heading">{activeKey}</h2>

          {productsByCategory[activeKey]?.map((item) => (
            <div className="col-6 col-md-3 mb-4 product-card-animate" key={item._id}>
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
                      <h6 className="product-title">{item.ProductName} <span>›</span></h6>
                      <p className="product-size">{item.size}</p>
                    </div>
                    <div className="price-wrap">
                      <span className="price-dot"></span>
                      <span className="product-price">₹ {item.ProductPrice}</span>
                    </div>
                  </div>

                  <div className="product-divider"></div>

                  <NavLink to={`/productdetails/${item._id}`}>
                    <Button size="sm" className="cart-btn w-100">VIEW PRODUCT</Button>
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