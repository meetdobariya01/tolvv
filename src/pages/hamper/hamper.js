import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./hamper.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiShoppingCart } from "react-icons/fi";
import {
  faAngleRight,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
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

function HamperPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedZodiacs, setSelectedZodiacs] = useState([]);
  // CHANGED: Initialize as an array for multiple selection
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [zodiacHampers, setZodiacHampers] = useState([]);
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

  const getCategoryCount = (category) => {
    return fetchedProducts
      .filter((p) => normalize(p.Category) === normalize(category))
      .reduce((sum, p) => sum + (qty[p._id] || 0), 0);
  };
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
  const getImage = (photos) => {
    if (!photos) return "";

    const img = Array.isArray(photos) ? photos[0] : photos;

    // 👉 If already full URL, return as is
    if (img.startsWith("http")) return img;

    // 👉 Otherwise attach API URL
    return `${img}`;
  };
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

        alert("Added to cart!");
      } catch (error) {
        console.error(error);
      }
    }

    // ✅ Guest user
    else {
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

      alert("Added to cart!");
    }
  };
  useEffect(() => {
    // UPDATED: Check for length of categories array
    if (selectedZodiacs.length > 0 && selectedCategories.length > 0) {
      const getProducts = async () => {
        try {
          const res = await axios.post(`${API_URL}/hamper/zodiac-products`, {
            zodiacs: selectedZodiacs,
            // Send the array to your backend (ensure backend handles { Category: { $in: categories } })
            category: selectedCategories,
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
    setSelectedZodiacs((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  // NEW: Handle Category Multiple Selection (Checkbox style)
  const handleCategoryToggle = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const updateQty = (id, type) => {
    setQty((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: type === "inc" ? current + 1 : Math.max(0, current - 1),
      };
    });
  };

  const handleAddToCart = async () => {
    const selectedItems = fetchedProducts.filter((p) => qty[p._id] > 0);

    const total = selectedItems.reduce(
      (sum, p) => sum + p.ProductPrice * qty[p._id],
      0,
    );

    if (total < 2500) {
      alert(`Minimum hamper value must be ₹2500. Current total: ₹${total}`);
      return;
    }

    const payload = {
      zodiacs: selectedZodiacs,
      products: selectedItems.map((p) => ({
        productId: p._id,
        quantity: qty[p._id],
      })),
      totalPrice: total,
    };

    const token = localStorage.getItem("token");

    try {
      // ================= LOGGED-IN =================
      if (token) {
        const res = await axios.post(`${API_URL}/hamper/create`, payload);

        const hamperId = res.data.hamper._id;

        await axios.post(
          `${API_URL}/cart/add-hamper`,
          { hamperId, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Hamper added to cart!");
      }

      // ================= GUEST USER =================
      else {
        let cart = [];

        try {
          const stored = localStorage.getItem("guestCart");
          cart = stored ? JSON.parse(stored) : [];
        } catch {
          cart = [];
        }

        // 🔥 Store FULL hamper object locally
        cart.push({
          type: "hamper",
          hamperData: payload, // full hamper config
          quantity: 1,
          price: total,
          name: "Custom Hamper",
          img: "/images/hamper.jpg",
        });

        localStorage.setItem("guestCart", JSON.stringify(cart));

        alert("Hamper added to cart!");
      }
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
        <p className="text-center sora">
          Beautifully presented in our signature branded Hamper Box, made for
          effortless Gifting. <br /> Includes a complimentary Face Towel for an
          added touch of care
        </p>

        <div className="row justify-content-center text-center sora gap-5">
          <div className="col-md-2 mb-4">
            <div
              className="hamper-card p-3"
              onClick={() => setActiveSection("zodiac")}
            >
              <img src="./images/hamper.jpg" className="w-100" alt="Zodiac" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="mt-3 hamper-title">Zodiac Hamper</h5>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  size="xl"
                  style={{ color: "#000" }}
                />
              </div>
              <hr />
              <p className="hamper-subtitle">Sun Sign Hamper</p>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <div
              className="hamper-card p-3"
              onClick={() => setActiveSection("craft")}
            >
              <img src="./images/hamper.jpg" className="w-100" alt="Craft" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="mt-3 hamper-title">Craft Your Hamper</h5>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  size="xl"
                  style={{ color: "#000" }}
                />
              </div>
              <hr />
              <p className="hamper-subtitle">
                Pick any sun sign and get a complimentary towel
              </p>
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
                      className="btn btn-outline-dark d-flex justify-content-start mb-2  fw-semibold"
                      onClick={(e) => {
                        e.stopPropagation(); // ❗ prevent card click
                        handleBuyNow(item);
                      }}
                    >
                      ADD TO CART <FiShoppingCart className="ms-1 mt-1" size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "craft" && (
          <div className="mt-5 sora">
            <h2 className="text-center artisan-font">Craft Your Hamper</h2>
            <p className="text-center mt-4 craft-hamper-description">
              Hamper needs to be above <b>2500/-</b>
            </p>

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
                  <div
                    className={`zodiac-img ${selectedZodiacs.includes(zodiac.name)}`}
                    onClick={() => handleZodiacToggle(zodiac.name)}
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
                      onClick={() => handleCategoryToggle(item.name)}
                      style={{
                        border: selectedCategories.includes(item.name),
                        cursor: "pointer",
                        padding: "10px",
                        position: "relative",
                      }}
                    >
                      {/* CHANGED: type="checkbox" and checked logic */}
                      <input
                        type="checkbox"
                        name="cat"
                        checked={selectedCategories.includes(item.name)}
                        readOnly
                        className="product-checkbox"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                        }}
                      />
                      <div className="hamper-product-img">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="hamper-product-info">
                        <h6>{item.name}</h6>
                        <div className="divider"></div>

                        {/* ✅ CATEGORY QTY CONTROL */}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className="text-muted">{item.size}</small>

                          {/* <div className="qty-box d-flex align-items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                const product = fetchedProducts.find(
                                  (p) =>
                                    normalize(p.Category) ===
                                      normalize(item.name) &&
                                    (qty[p._id] || 0) > 0,
                                );

                                if (product) updateQty(product._id, "dec");
                              }}
                            >
                              -
                            </button>

                            <span>{getCategoryCount(item.name)}</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                const product = fetchedProducts.find(
                                  (p) =>
                                    normalize(p.Category) ===
                                    normalize(item.name),
                                );

                                if (product) updateQty(product._id, "inc");
                              }}
                            >
                              +
                            </button>
                          </div> */}
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
                {fetchedProducts.length > 0 ? (
                  fetchedProducts.map((item) => (
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
                    Select at least one Zodiac and one Category to load
                    products.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={handleAddToCart}
            >
              ADD TO CART <FiShoppingCart className="ms-1" size={22} />
              {/* <FontAwesomeIcon
                icon={faCartShopping}
                flip="horizontal"
                size="xl"
                className="ms-2"
              /> */}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HamperPage;
