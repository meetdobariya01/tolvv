import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./hamper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
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
  {
    id: 1,
    name: "Bath Gel",
    size: "200 ml",
    img: "/images//bl.png",
  },
  {
    id: 2,
    name: "Body Lotion",
    size: "200 ml",
    img: "/images//bl.png",
  },
  {
    id: 3,
    name: "Perfume",
    size: "50 ml",
    img: "/images/pr.png",
  },
  {
    id: 4,
    name: "Essential Oil",
    size: "30 ml",
    img: "/images/eo.png",
  },
  {
    id: 5,
    name: "Soap",
    size: "100 gms",
    img: "/images/sp.png",
  },
];
const HamperproductData = [
  {
    id: 1,
    name: "Virgo Bath Gel",
    price: 750,
    size: "200 ml",
    img: "/images/bl.png",
  },
  {
    id: 2,
    name: "Virgo Body Lotion",
    price: 750,
    size: "200 ml",
    img: "/images/products/lotion.png",
  },
  {
    id: 3,
    name: "Virgo Perfume",
    price: 750,
    size: "200 ml",
    img: "/images/products/perfume.png",
  },
  {
    id: 4,
    name: "Virgo Essential Oil",
    price: 750,
    size: "200 ml",
    img: "/images/products/oil.png",
  },
];
function HamperPage() {
  const [activeSection, setActiveSection] = useState(null);

  const zodiacColors = {
    Aries: "#7b0f14",
    Taurus: "#2e7d32",
    Gemini: "#1565c0",
    Cancer: "#6a1b9a",
    Leo: "#f57c00",
    Virgo: "#00897b",
    Libra: "#c2185b",
    Scorpio: "#4a148c",
    Sagittarius: "#d84315",
    Capricorn: "#37474f",
    Aquarius: "#0277bd",
    Pisces: "#00695c",
  };
  const zodiacProducts = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const craftProducts = [
    { name: "Bath Gel" },
    { name: "Body Lotion" },
    { name: "Perfume" },
    { name: "Essential Oil" },
    { name: "Soap" },
  ];

  const [selected, setSelected] = useState([]);

  const handleSelect = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };
  // const [selected, setSelected] = useState([]);
  const [qty, setQty] = useState({});

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const updateQty = (id, type) => {
    setQty((prev) => {
      const current = prev[id] || 0;
      if (type === "inc") return { ...prev, [id]: current + 1 };
      if (type === "dec") return { ...prev, [id]: Math.max(0, current - 1) };
      return prev;
    });
  };
  return (
    <div>
      {/* Header */}
      <Header />

      <div className="container py-5">
        {/* Hampers Title */}
        <h2 className="text-center mb-5 artisan-font">Hampers</h2>

        {/* Two Sections */}
        <div className="row justify-content-center text-center sora gap-5">
          {/* Zodiac Hampers */}
          <div className="col-md-2 mb-4">
            <div
              className="hamper-card p-3"
              onClick={() => setActiveSection("zodiac")}
            >
              <img src="./images/hamper.jpg" className="w-100" alt="" />

              <div className="d-flex align-items-center justify-content-between w-100">
                <h5 className="mt-3 hamper-title">Zodiac Hamper</h5>

                <FontAwesomeIcon
                  icon={faAngleRight}
                  size="xl"
                  style={{ color: "#000" }}
                />
              </div>
              <div className="m-0">
                <hr />
              </div>
              <p className="hamper-subtitle">Sun Sign Hamper</p>
            </div>
          </div>

          {/* Craft Hampers */}
          <div className="col-md-2 mb-4">
            <div
              className="hamper-card p-3"
              onClick={() => setActiveSection("craft")}
            >
              <img src="./images/hamper.jpg" className="w-100" alt="" />

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

        {/* ZODIAC PRODUCTS */}
        {activeSection === "zodiac" && (
          <div className="mt-5">
            <h2 className="text-center artisan-font mb-5">Zodiac Hamper</h2>

            <div className="row">
              {zodiacProducts.map((item, index) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                  <div className="product-card text-center">
                    <img
                      src="./images/hamper.jpg"
                      className="img-fluid"
                      alt=""
                    />

                    <Card.Body className="product-info sora">
                      <div className="product-top">
                        <div className="title-wrap d-flex align-items-center justify-content-between w-100">
                          <h6 className="product-page-title">
                            <NavLink
                              className="text-decoration-none text-dark"
                              to={`/productdetails/${item._id}`}
                            >
                              Aries Bath gel <span>›</span>
                            </NavLink>
                          </h6>

                          <div className="price-wrap">
                            <div className="price-wrap d-flex align-items-center gap-2">
                              <span
                                className="zodiac-dot"
                                style={{
                                  backgroundColor:
                                    zodiacColors[item.Zodiac] || "#000",
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50%",
                                  display: "inline-block",
                                }}
                              ></span>

                              <span className="product-price">₹ 750</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="product-divider"></div>

                      <p className="product-size-hamper">200 ml</p>

                      {/* ✅ YOUR ZODIAC DOT / PRICE UI — UNTOUCHED */}

                      {/* <NavLink to={`/productdetails/${item._id}`}>
                    <Button size="sm" className="cart-btn text-uppercase w-md-50">
                      Add to Cart
                    </Button>
                  </NavLink> */}
                    </Card.Body>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CRAFT YOUR HAMPER */}
        {activeSection === "craft" && (
          <div className="mt-5 sora">
            <h2 className="text-center artisan-font">Craft Your Hamper</h2>

            <p className="text-center mt-4 craft-hamper-description">
              Hamper needs to be above <b>2500/-</b>
            </p>

            {/* Zodiac Selection */}
            <p className="hamper-zodiac-title-1">Pick a Zodiac</p>

            <div className="d-flex flex-wrap justify-content-between gap-4 my-4">
              {zodiacData.map((zodiac, index) => (
                <div key={index} className="zodiac-item-1 text-center">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selected.includes(zodiac.name)}
                    onChange={() => handleSelect(zodiac.name)}
                    className="mb-2 ms-5"
                  />

                  {/* Image */}
                  <div
                    className={`zodiac-img ${
                      selected.includes(zodiac.name) ? "active" : ""
                    }`}
                    onClick={() => handleSelect(zodiac.name)}
                  >
                    <img src={zodiac.img} alt={zodiac.name} />
                  </div>

                  {/* Name */}
                  <p className="mt-2 mb-0">{zodiac.name}</p>
                </div>
              ))}
            </div>

            {/* Product Selection */}

            <div className="container my-5">
              <h5 className="mb-4 fw-semibold">Pick your preferred products</h5>

              <div className="row">
                {productData.map((item) => (
                  <div
                    key={item.id}
                    className="col-lg-custom col-md-4 col-6 mb-4 "
                  >
                    {/* Card */}
                    <div className="hamper-product-card">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="product-checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />

                      {/* Image */}
                      <div className="hamper-product-img">
                        <img src={item.img} alt={item.name} />
                      </div>

                      {/* Info */}
                      <div className="hamper-product-info">
                        <h6>{item.name}</h6>
                        <div className="divider"></div>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{item.size}</small>

                          {/* Quantity */}
                          <div className="hamper-qty-box">
                            <button onClick={() => updateQty(item.id, "dec")}>
                              -
                            </button>
                            <span>{qty[item.id] || 0}</span>
                            <button onClick={() => updateQty(item.id, "inc")}>
                              +
                            </button>
                          </div>
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
                {HamperproductData.map((item) => (
                  <div key={item.id} className="col-lg-3 col-md-4 col-6">
                    <div className="hamper-card">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="hamper-checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />

                      {/* Image */}
                      <div className="hamper-img">
                        <img src={item.img} alt={item.name} />
                      </div>

                      {/* Info */}
                      <div className="hamper-info">
                        {/* Title + Price */}
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{item.name}</h6>

                          <div className="d-flex align-items-center gap-1">
                            <span className="color-dot"></span>
                            <small>₹ {item.price}</small>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="divider"></div>

                        {/* Bottom Row */}
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{item.size}</small>

                          <div className="qty-box">
                            <button onClick={() => updateQty(item.id, "dec")}>
                              -
                            </button>
                            <span>{qty[item.id] || 0}</span>
                            <button onClick={() => updateQty(item.id, "inc")}>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" class="btn btn-outline-dark">ADD TO CART <FontAwesomeIcon icon={faCartShopping} flip="horizontal" size="xl" /></button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HamperPage;
