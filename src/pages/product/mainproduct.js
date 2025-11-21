import React, { useState, useEffect } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Mainproduct = () => {
  const [activeKey, setActiveKey] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();

  const categories = ["Bath Gel", "Soap", "Perfume", "Essential Oil", "Body Lotion"];
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        const data = res.data;

        const grouped = {};
        categories.forEach((cat) => (grouped[cat] = []));

        data.forEach((prod) => {
          const category = prod.Category?.trim();
          if (grouped[category]) {
            // 🚫 Prevent duplicates
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
        "http://localhost:3000/add-to-cart",
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
        <Accordion activeKey={activeKey}>
          {categories.map((cat, index) => (
            <Accordion.Item
              key={index}
              eventKey={index.toString()}
              onClick={() =>
                setActiveKey(activeKey === index.toString() ? null : index.toString())
              }
            >
              <Accordion.Header>{cat}</Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  {productsByCategory[cat]?.map((item) => (
                    <div className="col-6 col-md-3 mb-4" key={item._id}>
                      <Card className="border-0 shadow-sm">
                        <Card.Img
                          variant="top"
                          src={
                            item.Photos
                              ? item.Photos.startsWith("http")
                                ? item.Photos
                                : `http://localhost:3000/images/${item.Photos.replace("images/", "")}`
                              : "/images/default.jpg"
                          }
                          style={{ height: "220px", objectFit: "cover" }}
                        />

                        <Card.Body className="text-center">
                          <Card.Title style={{ fontSize: "18px" }}>
                            {item.ProductName}
                          </Card.Title>
                          <p className="fw-bold text-muted mb-2">₹{item.ProductPrice}</p>

                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-0 w-100"
                            onClick={() => handleBuyNow(item._id)}
                          >
                            BUY NOW
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default Mainproduct;
