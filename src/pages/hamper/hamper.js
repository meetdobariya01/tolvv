import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./hamper.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const zodiacData = [
  { name: "Aries", img: "/images/zodiac/1-2.png" },
  { name: "Taurus", img: "/images/zodiac/2-2.png" },
  { name: "Gemini", img: "/images/zodiac/3-2.png" },
  { name: "Cancer", img: "/images/zodiac/4-2.png" },
  { name: "Leo", img: "/images/zodiac/5-2.png" },
  { name: "Virgo", img: "/images/zodiac/6-2.png" },
  { name: "Libra", img: "/images/zodiac/7-2.png" },
  { name: "Scorpio", img: "/images/zodiac/8-2.png" },
  { name: "Sagittarius", img: "/images/zodiac/9-2.png" },
  { name: "Capricorn", img: "/images/zodiac/10-2.png" },
  { name: "Aquarius", img: "/images/zodiac/11-2.png" },
  { name: "Pisces", img: "/images/zodiac/12-2.png" },
];
const productData = [
  { id: 1, name: "Bath Gel", size: "200 ml", img: "/images/bl.png" },
  { id: 2, name: "Body Lotion", size: "200 ml", img: "/images/bl.png" },
  { id: 3, name: "Perfume", size: "50 ml", img: "/images/pr.png" },
  { id: 4, name: "Essential Oil", size: "30 ml", img: "/images/eo.png" },
  { id: 5, name: "Soap", size: "100 gms", img: "/images/sp.png" },
];

function HamperPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedZodiacs, setSelectedZodiacs] = useState([]);
  // CHANGED: Initialize as an array for multiple selection
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [zodiacHampers, setZodiacHampers] = useState([]);
  const zodiacColors = {
    Aries: "#7b0f14", Taurus: "#2e7d32", Gemini: "#1565c0", Cancer: "#6a1b9a",
    Leo: "#f57c00", Virgo: "#00897b", Libra: "#c2185b", Scorpio: "#4a148c",
    Sagittarius: "#d84315", Capricorn: "#37474f", Aquarius: "#0277bd", Pisces: "#00695c",
  };
  useEffect(() => {
    const fetchHampers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products/zodiac-hampers");
        setZodiacHampers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHampers();
  }, []);
  useEffect(() => {
    // UPDATED: Check for length of categories array
    if (selectedZodiacs.length > 0 && selectedCategories.length > 0) {
      const getProducts = async () => {
        try {
          const res = await axios.post("http://localhost:4000/api/hamper/zodiac-products", {
            zodiacs: selectedZodiacs,
            // Send the array to your backend (ensure backend handles { Category: { $in: categories } })
            category: selectedCategories
          });
          setFetchedProducts(res.data);
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      };
      getProducts();
    } else {
      setFetchedProducts([]); // Clear products if selection is empty
    }
  }, [selectedZodiacs, selectedCategories]);

  const handleZodiacToggle = (name) => {
    setSelectedZodiacs(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  // NEW: Handle Category Multiple Selection (Checkbox style)
  const handleCategoryToggle = (name) => {
    setSelectedCategories(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const updateQty = (id, type) => {
    setQty(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: type === "inc" ? current + 1 : Math.max(0, current - 1) };
    });
  };

  const handleAddToCart = async () => {
    const selectedItems = fetchedProducts.filter(p => qty[p._id] > 0);
    const total = selectedItems.reduce((sum, p) => sum + (p.ProductPrice * qty[p._id]), 0);

    if (total < 2500) {
      alert(`Minimum hamper value must be ₹2500. Current total: ₹${total}`);
      return;
    }

    const payload = {
      zodiacs: selectedZodiacs,
      products: selectedItems.map(p => ({
        productId: p._id,
        quantity: qty[p._id]
      })),
      totalPrice: total
    };
    try {
      // Step 1: Create hamper
      const res = await axios.post(
        "http://localhost:4000/api/hamper/create",
        payload
      );

      const hamperId = res.data.hamper._id; // make sure backend returns hamper

      // Step 2: Add to cart
      await axios.post(
        "http://localhost:4000/api/cart/add-hamper",
        { hamperId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Hamper added to cart successfully!");

    } catch (err) {
      alert(err.response?.data?.message || "Error adding hamper");
    }
  };

  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="container py-5">
        <h2 className="text-center mb-5 artisan-font">Hampers</h2>

        <div className="row justify-content-center text-center sora gap-5">
          <div className="col-md-2 mb-4">
            <div className="hamper-card p-3" onClick={() => setActiveSection("zodiac")}>
              <img src="./images/hamper.jpg" className="w-100" alt="Zodiac" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="mt-3 hamper-title">Zodiac Hamper</h5>
                <FontAwesomeIcon icon={faAngleRight} size="xl" style={{ color: "#000" }} />
              </div>
              <hr /><p className="hamper-subtitle">Sun Sign Hamper</p>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div className="hamper-card p-3" onClick={() => setActiveSection("craft")}>
              <img src="./images/hamper.jpg" className="w-100" alt="Craft" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="mt-3 hamper-title">Craft Your Hamper</h5>
                <FontAwesomeIcon icon={faAngleRight} size="xl" style={{ color: "#000" }} />
              </div>
              <hr /><p className="hamper-subtitle">Pick any sun sign and get a complimentary towel</p>
            </div>
          </div>
        </div>

        {activeSection === "zodiac" && (
          <div className="mt-5">
            <h2 className="text-center artisan-font mb-5">Zodiac Hamper</h2>
            <div className="row">
              {zodiacHampers.map((item) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={item._id}>
                  <div
                    className="product-card text-center"
                    onClick={() => navigate(`/productdetails/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={item.Photos} className="img-fluid" alt={item.ProductName} />
                    <Card.Body className="product-info sora">
                      <div className="product-top">
                        <div className="title-wrap d-flex align-items-center justify-content-between w-100">
                          <h6 className="product-page-title">{item.ProductName} <span>›</span></h6>
                          <div className="price-with-dot-1 d-flex align-items-center gap-2">
                            <span
                              className="zodiac-dot"
                              style={{ backgroundColor: zodiacColors[item.Zodiac] || "#000" }}
                            ></span>

                            <span className="product-price">
                              ₹ {item.ProductPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="product-divider"></div>
                      <p className="product-size-hamper">Standard Kit</p>
                    </Card.Body>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "craft" && (
          <div className="mt-5 sora">
            <h2 className="text-center artisan-font">Craft Your Hamper</h2>
            <p className="text-center mt-4 craft-hamper-description">Hamper needs to be above <b>2500/-</b></p>

            <p className="hamper-zodiac-title-1">Pick a Zodiac</p>
            <div className="d-flex flex-wrap justify-content-between gap-4 my-4">
              {zodiacData.map((zodiac, index) => (
                <div key={index} className="zodiac-item-1 text-center">
                  <input
                    type="checkbox"
                    checked={selectedZodiacs.includes(zodiac.name)}
                    onChange={() => handleZodiacToggle(zodiac.name)}
                    className="mb-2 ms-5"
                  />
                  <div className={`zodiac-img ${selectedZodiacs.includes(zodiac.name) ? "active" : ""}`} onClick={() => handleZodiacToggle(zodiac.name)}>
                    <img src={zodiac.img} alt={zodiac.name} />
                  </div>
                  <p className="mt-2 mb-0">{zodiac.name}</p>
                </div>
              ))}
            </div>

            <div className="container my-5">
              <h5 className="mb-4 fw-semibold">Pick your preferred products</h5>
              <div className="row">
                {productData.map((item) => (
                  <div key={item.id} className="col-lg-custom col-md-4 col-6 mb-4">
                    <div
                      className="hamper-product-card"
                      onClick={() => handleCategoryToggle(item.name)}
                      style={{
                        border: selectedCategories.includes(item.name) ? "2px solid #000" : "1px solid #eee",
                        cursor: "pointer",
                        padding: "10px",
                        position: "relative"
                      }}
                    >
                      {/* CHANGED: type="checkbox" and checked logic */}
                      <input
                        type="checkbox"
                        name="cat"
                        checked={selectedCategories.includes(item.name)}
                        readOnly
                        className="product-checkbox"
                        style={{ position: "absolute", top: "10px", right: "10px" }}
                      />
                      <div className="hamper-product-img"><img src={item.img} alt={item.name} /></div>
                      <div className="hamper-product-info">
                        <h6>{item.name}</h6>
                        <div className="divider"></div>
                        <small className="text-muted">{item.size}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="container my-4">
              <h6 className="fw-semibold mb-3 fs-5">Your Hamper</h6>
              <div className="row g-3">
                {fetchedProducts.length > 0 ? (
                  fetchedProducts.map((item) => (
                    <div key={item._id} className="col-lg-3 col-md-4 col-6">
                      <div className="hamper-card p-2 border">
                        <input type="checkbox" className="hamper-checkbox" checked={(qty[item._id] || 0) > 0} onChange={() => updateQty(item._id, (qty[item._id] || 0) > 0 ? "dec" : "inc")} />
                        <div className="hamper-img"><img src={item.Photos} alt={item.ProductName} style={{ width: '100%' }} /></div>
                        <div className="hamper-info">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0" style={{ fontSize: '14px' }}>{item.ProductName}</h6>
                            <small>₹ {item.ProductPrice}</small>
                          </div>
                          <div className="divider"></div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{item.size}</small>
                            <div className="qty-box">
                              <button onClick={() => updateQty(item._id, "dec")}>-</button>
                              <span>{qty[item._id] || 0}</span>
                              <button onClick={() => updateQty(item._id, "inc")}>+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Select at least one Zodiac and one Category to load products.</p>
                )}
              </div>
            </div>

            <button type="button" className="btn btn-outline-dark" onClick={handleAddToCart}>
              ADD TO CART <FontAwesomeIcon icon={faCartShopping} flip="horizontal" size="xl" className="ms-2" />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HamperPage;