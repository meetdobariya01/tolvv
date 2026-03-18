import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import "./mainproduct.css";

const API_URL = process.env.REACT_APP_API_URL;

const Mainproduct = () => {
  const [activeKey, setActiveKey] = useState("");
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

  // ✅ Category cards (clickable)
  const products = [
    {
      title: "Bath Gel",
      size: "200 ml",
      img: "/images/bl.png",
      category: "Bath Gel",
    },
    {
      title: "Body Lotion",
      size: "200 ml",
      img: "/images/bb.png",
      category: "Body Lotion",
    },
    {
      title: "Perfume",
      size: "50 ml",
      img: "/images/pr.png",
      category: "Perfume",
    },
    {
      title: "Essential Oil",
      size: "30 ml",
      img: "/images/eo.png",
      category: "Essential Oil",
    },
    { title: "Soap", size: "100 gsm", img: "/images/sp.png", category: "Soap" },
    {
      title: "Hamper",
      size: "",
      img: "/images/hamper.jpg",
      category: "Hamper",
      link: "/productdetails/hamper",
    },
  ];
  const zodiacColors = {
    Aries: "#C0392B",
    Taurus: "#27AE60",
    Gemini: "#F1C40F",
    Cancer: "#5DADE2",
    Leo: "#E67E22",
    Virgo: "#16A085",
    Libra: "#AF7AC5",
    Scorpio: "#922B21",
    Sagittarius: "#D35400",
    Capricorn: "#2C3E50",
    Aquarius: "#48C9B0",
    Pisces: "#5B2C6F",
  };
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
  const handleBuyNow = async (product) => {
    if (!product) return;

    const token = localStorage.getItem("token");

    // ✅ LOGGED-IN USER
    if (token) {
      try {
        await axios.post(
          `${API_URL}/cart/add`,
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        navigate("/cart");
      } catch (error) {
        console.error("Add to cart error:", error.response || error);

        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    // ✅ GUEST USER
    else {
      let cart = [];

      try {
        const stored = Cookies.get("guestCart");
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
      } catch {
        cart = [];
      }

      const existing = cart.find((item) => item.productId === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          type: "product",
          productId: product._id,
          quantity: 1,
          price: product.ProductPrice,
          name: product.ProductName,
          img: product.Photos,
        });
      }

      Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
      navigate("/cart");
    }
  };
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
      {/* <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-dark  ">
          <h1 className="gt-super">
            CELESTIAL CARE
          </h1>
          <p className="hero-subtitle sora">
            Crafted for your skin’s glow.
          </p>
          <p className="hero-desc sora">
            Explore products from bath gels to essential oils
          </p>
        </div>
      </section> */}

      <div className="container py-5">
        {/* CATEGORY GRID */}
        <section className="products-section-grid">
          <Container>
            <Row className="gx-3 gy-3 mb-5">
              <h2 className="products-heading artisan-font mt-5">
                All Sun Signs
              </h2>
              {products.map((item, index) => (
                <Col key={index} xs={6} sm={6} md={4} lg={2}>
                  <div
                    className="product-card p-2"
                    onClick={() => handleCategoryClick(item.category)}
                    style={{ cursor: "pointer" }}
                  >
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
        <div id="product-grid" className="row product-fade mt-4">
          <h2 className="products-heading artisan-font">{activeKey}</h2>

          {productsByCategory[activeKey]?.map((item) => (
            <div
              className="col-6 col-md-3 mb-4 product-card-animate"
              key={item._id}
            >
              <Card className="product-card p-1">
                {/* ✅ IMAGE CLICK → PRODUCT DETAILS */}
                <NavLink to={`/productdetails/${item._id}`}>
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
                </NavLink>

                <Card.Body className="product-info sora">
                  <div className="product-top">
                    <div className="title-wrap">
                      <h6 className="product-page-title">
                        <NavLink
                          className="text-decoration-none text-dark"
                          to={`/productdetails/${item._id}`}
                        >
                          {item.ProductName} <span>›</span>
                        </NavLink>
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

                  {/* <NavLink to={`/productdetails/${item._id}`}>
                    <Button
                      size="sm"
                      className="cart-btn text-uppercase w-md-50"
                    >
                      Add to Cart
                    </Button>
                  </NavLink> */}
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
