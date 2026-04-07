import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./hamper.css";
import { useNavigate, useLocation  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiShoppingCart } from "react-icons/fi";
import {
  faAngleRight,
  faCartShopping,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Card, Container } from "react-bootstrap";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_URL = process.env.REACT_APP_API_URL;
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

function HamperPage({ handleCartOpen }) {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [zodiacHampers, setZodiacHampers] = useState([]);
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [allAddedProducts, setAllAddedProducts] = useState([]);

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

  const normalize = (str) => str?.toLowerCase().replace(/\s/g, "");

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/zodiac-hampers`);
        setZodiacHampers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHampers();
  }, []);

  const handleZodiacSelect = (name) => {
    setSelectedZodiac(name);
    setSelectedCategories([]);
    // Don't clear existing products when zodiac changes
  };

  const getImage = (photos) => {
    if (!photos) return "";
    const img = Array.isArray(photos) ? photos[0] : photos;
    if (img.startsWith("http")) return img;
    return `${img}`;
  };

  const handleBuyNow = async (product) => {
    if (!product) return;

    const token = localStorage.getItem("token");

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

        if (handleCartOpen) {
          handleCartOpen();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      let cart = [];
      try {
        const stored = localStorage.getItem("guestCart");
        cart = stored ? JSON.parse(stored) : [];
      } catch {
        cart = [];
      }

      const existing = cart.find((item) => item.productId === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: product._id,
          quantity: 1,
          price: product.ProductPrice,
          name: product.ProductName,
          img: getImage(product.Photos),
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      if (handleCartOpen) {
        handleCartOpen();
      }
    }
  };

  useEffect(() => {
    if (selectedZodiac && selectedCategories.length > 0) {
      const getProducts = async () => {
        try {
          const res = await axios.post(`${API_URL}/hamper/zodiac-products`, {
            zodiacs: [selectedZodiac],
            category: selectedCategories,
          });

          const existingProductIds = new Set(
            allAddedProducts.map((p) => p._id),
          );
          const newProducts = res.data.filter(
            (p) => !existingProductIds.has(p._id),
          );

          setAllAddedProducts((prev) => [...prev, ...newProducts]);
          setFetchedProducts(res.data);
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      };
      getProducts();
    }
  }, [selectedZodiac, selectedCategories]);

  const handleCategoryToggle = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const handleProductClick = (product) => {
    if (!selectedZodiac) {
      alert("Please select a zodiac sign first");
      return;
    }

    const productExists = allAddedProducts.some((p) => p._id === product._id);

    if (!productExists) {
      setAllAddedProducts((prev) => [...prev, product]);
      setQty((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || 0) + 1,
      }));
    } else {
      setQty((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || 0) + 1,
      }));
    }
  };

  const updateQty = (id, type) => {
    setQty((prev) => {
      const current = prev[id] || 0;
      const newQty = type === "inc" ? current + 1 : Math.max(0, current - 1);

      return {
        ...prev,
        [id]: newQty,
      };
    });
  };

  // FIXED: Handle Add to Cart for Custom Hamper
  const handleAddToCart = async () => {
    const selectedItems = allAddedProducts.filter((p) => (qty[p._id] || 0) > 0);

    if (selectedItems.length === 0) {
      alert("Please add at least one product to your hamper");
      return;
    }

    const total = selectedItems.reduce(
      (sum, p) => sum + p.ProductPrice * (qty[p._id] || 0),
      0,
    );

    if (total < 2500) {
      alert(`Minimum hamper value must be ₹2500. Current total: ₹${total}`);
      return;
    }

    const payload = {
      zodiacs: [selectedZodiac],
      products: selectedItems.map((p) => ({
        productId: p._id,
        quantity: qty[p._id] || 0,
      })),
      totalPrice: total,
    };

    const token = localStorage.getItem("token");

    try {
      if (token) {
        // For logged-in users: Create hamper in backend first
        const res = await axios.post(`${API_URL}/hamper/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const hamperId = res.data.hamper._id;

        // Add hamper to cart
        await axios.post(
          `${API_URL}/cart/add-hamper`,
          { hamperId, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Custom Hamper added to cart successfully!");

        // Reset hamper selection
        setAllAddedProducts([]);
        setQty({});
        setSelectedCategories([]);
        setSelectedZodiac("");

        if (handleCartOpen) {
          handleCartOpen();
        }
      } else {
        // For guest users: Store hamper in localStorage
        let cart = [];
        try {
          const stored = localStorage.getItem("guestCart");
          cart = stored ? JSON.parse(stored) : [];
        } catch {
          cart = [];
        }

        const hamperId = `hamper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Store complete hamper details with all products
        cart.push({
          id: hamperId,
          type: "hamper",
          hamperData: payload,
          hamperProducts: selectedItems.map((p) => ({
            productId: {
              _id: p._id,
              ProductName: p.ProductName,
              ProductPrice: p.ProductPrice,
              Photos: p.Photos,
              Category: p.Category,
            },
            quantity: qty[p._id] || 0,
          })),
          quantity: 1,
          price: total,
          name: "Custom Hamper",
          img: "/images/hamper.jpg",
        });

        localStorage.setItem("guestCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        alert("Custom Hamper added to cart!");

        // Reset hamper selection
        setAllAddedProducts([]);
        setQty({});
        setSelectedCategories([]);
        setSelectedZodiac("");

        if (handleCartOpen) {
          handleCartOpen();
        }
      }
    } catch (err) {
      console.error("Error adding hamper:", err);
      alert(err.response?.data?.message || "Error adding hamper to cart");
    }
  };

  const navigate = useNavigate();
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

      <div className="hamper-section">
        <Container>
          <h2 className="text-center mb-5 artisan-font">Hampers</h2>
          <p className="text-center sora">
            Beautifully presented in our signature branded Hamper Box, made for
            effortless Gifting. <br /> Includes a complimentary Face Towel for
            an added touch of care
          </p>

          <div className="sora">
            <div className="container-fluid">
              <div className="row align-items-center justify-content-center">
                {/* LEFT CARD */}
                <div className="col-lg-4 col-md-4 col-10 mb-4 mb-lg-0">
                  <div
                    className="hamper-card side-card d-flex gap-2 left-card"
                    onClick={() => setActiveSection("zodiac")}
                  >
                    <div className="align-items-center">
                      <div className="d-flex justify-content-between align-items-start mt-3">
                        <h5 className="hamper-title">Zodiac Hampers</h5>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </div>
                      <hr />
                      <p className="hamper-subtitle">
                        Choose Your Sun Sign <br />
                        To Explore Products Crafted For It & Enjoy A
                        Complimentary Face Towel
                      </p>
                    </div>
                    <img
                      src="./images/hamper-1.png"
                      className="w-50"
                      alt="Zodiac"
                    />
                  </div>
                </div>

                {/* CENTER IMAGE */}
                <div className="col-lg-4 col-md-6 col-12 text-center mb-4 mb-lg-0">
                  <div className="center-image-wrapper">
                    <img
                      src="./images/hamper-banner.png"
                      className="center-image"
                      alt="Main"
                    />
                  </div>
                </div>

                {/* RIGHT CARD */}
                <div className="col-lg-4 col-md-4 col-10">
                  <div
                    className="hamper-card side-card d-flex gap-2 right-card"
                    onClick={() => setActiveSection("craft")}
                  >
                    <img
                      src="./images/hamper-2.png"
                      className="w-50"
                      alt="Craft"
                    />
                    <div>
                      <div className="d-flex justify-content-between align-items-start mt-3">
                        <FontAwesomeIcon icon={faAngleLeft} />
                        <h5 className="hamper-title text-end w-100">
                          Curate Your Hamper
                        </h5>
                      </div>
                      <hr />
                      <p className="hamper-subtitle text-end">
                        Choose Your Sun Sign <br />
                        To Explore Products Crafted For It & Enjoy A
                        Complimentary Face Towel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="container ">
        {activeSection === "zodiac" && (
          <div className="mt-5">
            <h2 className="text-center artisan-font">Zodiac Hampers</h2>
            <p className="text-center m-0 sora">
              Curated for your Zodiac, Crafted for your Self-Care Ritual.
            </p>
            <p className="sora text-center mb-5">
              Each hamper includes a Body Lotion, Bath Gel, Bath Soap, Essential
              Oil and Eau De Perfume
            </p>
            <div className="row">
              {zodiacHampers.map((item) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={item._id}>
                  <div
                    className="product-card-hamper text-center"
                    onClick={() => navigate(`/productdetails/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={getImage(item.Photos)}
                      className="img-fluid"
                      alt={item.ProductName}
                    />
                    <Card.Body className="product-info sora p-1">
                      <div className="product-top">
                        <div className="title-wrap d-block d-md-flex align-items-center justify-content-between w-100">
                          <div className="price-with-dot-1 d-flex align-items-center gap-2">
                            <span
                              className="zodiac-dot"
                              style={{
                                backgroundColor:
                                  zodiacColors[item.Zodiac] || "#000",
                              }}
                            ></span>
                            <h6 className="product-page-title">
                              {item.ProductName} <span>›</span>
                            </h6>
                          </div>
                          <div className="price-with-dot-1 d-flex align-items-center gap-2">
                            <span className="product-price">
                              ₹ {item.ProductPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="product-divider"></div>
                    </Card.Body>
                    <button
                      className="btn btn-outline-dark d-flex justify-content-start mb-2 fw-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(item);
                      }}
                    >
                      ADD TO CART{" "}
                      <FiShoppingCart className="ms-1 mt-1" size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "craft" && (
          <div className="mt-5 sora">
            <h2 className="text-center artisan-font">Curate Your Hamper</h2>
            <p className="text-center m-0 sora">
              Curate Your Hamper With Different Sun Sign Products And Enjoy A
              Complimentary Face Towel
            </p>
            <p className="text-center mt-2 mb-5">
              Minimum purchase of ₹ 2,500 applies to all Curated Hampers
            </p>

            <p className="hamper-zodiac-title-1">Pick a Zodiac</p>
            <div className="d-flex flex-wrap justify-content-between gap-4 my-4">
              {zodiacData.map((zodiac, index) => (
                <div key={index} className="zodiac-item-1 text-center">
                  <input
                    type="radio"
                    name="zodiac"
                    checked={selectedZodiac === zodiac.name}
                    onChange={() => handleZodiacSelect(zodiac.name)}
                    className="mb-2 ms-5"
                  />
                  <div
                    className={`zodiac-img ${selectedZodiac === zodiac.name ? "active" : ""}`}
                    onClick={() => handleZodiacSelect(zodiac.name)}
                  >
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
                  <div
                    key={item.id}
                    className="col-lg-custom col-md-4 col-6 mb-4"
                  >
                    <div
                      className="hamper-product-card"
                      style={{
                        padding: "10px",
                        position: "relative",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="cat"
                        checked={selectedCategories.includes(item.name)}
                        onChange={() => handleCategoryToggle(item.name)}
                        className="product-checkbox"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 1,
                        }}
                      />
                      <div
                        className="hamper-product-img"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (!selectedZodiac) {
                            alert("Please select a zodiac sign first");
                            return;
                          }
                          handleCategoryToggle(item.name);
                        }}
                      >
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="hamper-product-info">
                        <h6>{item.name}</h6>
                        <div className="divider"></div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">{item.size}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="container my-4">
              <h6 className="fw-semibold mb-3 fs-5">Your Hamper</h6>
              <div className="row g-3">
                {allAddedProducts.length > 0 ? (
                  allAddedProducts.map((item) => (
                    <div key={item._id} className="col-lg-3 col-md-4 col-6">
                      <div className="hamper-card p-2">
                        <input
                          type="checkbox"
                          className="hamper-checkbox"
                          checked={(qty[item._id] || 0) > 0}
                          onChange={() =>
                            updateQty(
                              item._id,
                              (qty[item._id] || 0) > 0 ? "dec" : "inc",
                            )
                          }
                        />
                        <div className="hamper-img">
                          <img
                            src={getImage(item.Photos)}
                            alt={item.ProductName}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="hamper-info">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-1">
                              <span
                                className="zodiac-dot"
                                style={{
                                  backgroundColor:
                                    zodiacColors[item.Zodiac] || "#000",
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  display: "inline-block",
                                }}
                              ></span>
                              <h6 className="mb-0" style={{ fontSize: "14px" }}>
                                {item.ProductName}
                              </h6>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <small>₹ {item.ProductPrice}</small>
                            </div>
                          </div>
                          <div className="divider"></div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{item.size}</small>
                            <div className="qty-box">
                              <button
                                onClick={() => updateQty(item._id, "dec")}
                              >
                                -
                              </button>
                              <span>{qty[item._id] || 0}</span>
                              <button
                                onClick={() => updateQty(item._id, "inc")}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    {!selectedZodiac
                      ? "Please select a zodiac sign first"
                      : "Select at least one category to add products to your hamper"}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-dark mb-5"
              onClick={handleAddToCart}
            >
              ADD TO CART <FiShoppingCart className="ms-1" size={22} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HamperPage;
