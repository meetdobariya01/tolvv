import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./hamper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

function HamperPage() {
  const [activeSection, setActiveSection] = useState(null);
    const [activeKey, setActiveKey] = useState("all");

  const productsByCategory = {
    all: [
      { id: 1, name: "Aries Bath Gel", price: 750 },
    ],
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

                    <NavLink to={`/productdetails/${item._id}`}>
                      <Button
                        size="sm"
                        className="cart-btn text-uppercase w-md-50"
                      >
                        Add to Cart
                      </Button>
                    </NavLink>
                  </Card.Body>
                </Card>
              </div>
            ))}
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

            <div className="d-flex flex-wrap justify-content-center gap-3 my-4">
              {zodiacProducts.map((zodiac, index) => (
                <button key={index} className="btn btn-light">
                  {zodiac}
                </button>
              ))}
            </div>

            {/* Product Selection */}

            <div className="row">
              {craftProducts.map((product, index) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
                  <div className="product-card text-center">
                    <img
                      src="https://dummyimage.com/300x300/e5e5e5/000"
                      className="img-fluid"
                      alt=""
                    />

                    <p className="mt-2">{product.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HamperPage;
