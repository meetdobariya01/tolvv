import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import "./mainproduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;
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
const Mainproduct = ({ handleCartOpen }) => {
  const [activeKey, setActiveKey] = useState("");
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

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
    },
  ];
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

  
  const categories = products.map((p) => p.category);

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
}, []); // ✅ IMPORTANT

  const handleBuyNow = async (product) => {
    if (!product) return;

    const token = localStorage.getItem("token");

    // ✅ Logged-in user
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

        // ✅ SAFE CALL
        if (handleCartOpen) {
          handleCartOpen();
        } else {
          navigate("/cart"); // fallback (no sidebar case)
        }
      } catch (error) {
        console.error("Add to cart error:", error.response || error);

        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    // ✅ Guest user
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

      // ✅ SAFE CALL
      if (handleCartOpen) {
        handleCartOpen();
      } else {
        navigate("/cart");
      }
    }
  };

  const handleCategoryClick = (category) => {
    setActiveKey(category);
    document
      .getElementById("product-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  const getZodiacFromProduct = (name) => {
    if (!name) return null;
    return Object.keys(zodiacColors).find((zodiac) =>
      name.toLowerCase().includes(zodiac.toLowerCase()),
    );
  };
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);
  return (
    <div>
      <Header />

      <div className="container py-5 sora">
        <section className="products-section-grid">
          <Container>
            <Row className="gx-0 gy-3 mb-5">
              <h2 className="products-heading artisan-font mt-5">
                All Sun Signs
              </h2>
              <h5 className="products-subheading text-center mb-5 text-uppercase sora">
                Product
              </h5>
              {products.map((item, index) => (
                <Col key={index} xs={4} sm={6} md={4} lg={2}>
                  <div
                    className="product-card p-2"
                    onClick={() => {
                      if (item.category === "Hamper") {
                        navigate("/hamper"); // ✅ go to hamper page
                      } else {
                        handleCategoryClick(item.category);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-img-card">
                      <img src={item.img} alt={item.title} />
                    </div>
                    <div className="product-info-collection">
                      <div className="d-flex justify-content-between">
                        <h5>{item.title}</h5>
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="responsive-icon"
                        />
                      </div>
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
                        item.Photos &&
                        Array.isArray(item.Photos) &&
                        item.Photos.length > 0
                          ? item.Photos[0].startsWith("http")
                            ? item.Photos[0]
                            : `/images/${item.Photos[0].replace("images/", "")}`
                          : "/images/default.jpg"
                      }
                    />
                  </div>
                </NavLink>

                <div className="product-info sora">
                  {/* ✅ NAME + DOT */}
                  <div className="price-with-dot-1">
                    <span
                      className="zodiac-dot-product"
                      style={{
                        backgroundColor:
                          zodiacColors[
                            getZodiacFromProduct(item.ProductName)
                          ] || "#000",
                      }}
                    ></span>

                    <h6 className="product-page-title m-0">
                      <NavLink
                        className="text-decoration-none text-dark product-page-title"
                        to={`/productdetails/${item._id}`}
                      >
                        {item.ProductName}{" "}
                        <FontAwesomeIcon icon={faAngleRight} size="lg" />
                      </NavLink>
                    </h6>
                  </div>

                  <div className="product-divider"></div>

                  {/* ✅ SIZE + PRICE */}
                  <div className="size-price-row">
                    <span className="product-size">{item.size}</span>
                    <span className="product-price">₹ {item.ProductPrice}</span>
                  </div>
                </div>
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
