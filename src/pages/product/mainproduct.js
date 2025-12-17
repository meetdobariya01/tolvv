import React, { useState, useEffect } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
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

     <div className="container py-5">
  {/* CATEGORY NAVBAR */}
  <div className="category-navbar mb-4">
    {categories.map((cat, index) => (
      <button
        key={index}
        className={`category-btn ${
          activeKey === cat ? "active" : ""
        }`}
        onClick={() => setActiveKey(cat)}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* PRODUCT GRID */}
  <div className="row product-fade">
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
                    : `/images/${item.Photos.replace(
                        "images/",
                        ""
                      )}`
                  : "/images/default.jpg"
              }
            />
          </div>

          <Card.Body className="text-center">
            <h6 className="product-title zalando-sans-expanded">{item.ProductName}</h6>
            <p className="product-size zalando-sans-expanded">{item.size}</p>
            <p className="product-price">₹{item.ProductPrice}</p>

            <Button
              size="sm"
              className="buy-btn"
              onClick={() => handleBuyNow(item._id)}
            >
              BUY NOW
            </Button>
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
