import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./moonsection.css";

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

const SaturnSection = () => {
  const [capricornItems, setCapricornItems] = useState([]);
  const [aquariusItems, setAquariusItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const planet = {
    name: "Saturn",
    image: "/images/saturn.png",
    bg: "#211F1B",
    description:
      "The Wise Elder Woman guiding discipline, mastery and grounded growth.",
    meta: {
      energy: "Wisdom, Mastery",
      colour: "Black",
      element: "Earth",
      rules: "Capricorn & Aquarius",
    },
    zodiac: "Capricorn & Aquarius",
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const getCategoryOrder = (category) => {
      const cat = (category || "").toLowerCase();

      if (cat.includes("bath")) return 1;
      if (cat.includes("body")) return 2;
      if (cat.includes("perfume")) return 3;
      if (cat.includes("essential")) return 4;
      if (cat.includes("soap")) return 5;
      if (cat.includes("hamper")) return 6;

      return 99;
    };

    Promise.all([
      axios.get(`${API_URL}/products/zodiac/Capricorn`),
      axios.get(`${API_URL}/products/zodiac/Aquarius`),
    ])
      .then(([capRes, aquRes]) => {
        // ✅ USE BACKEND ZODIAC (NO NAME CHECK)
        let capricorn = capRes.data || [];
        let aquarius = aquRes.data || [];

        // ✅ REMOVE DUPLICATES
        const unique = (arr) =>
          Array.from(new Map(arr.map((p) => [p._id, p])).values());

        capricorn = unique(capricorn);
        aquarius = unique(aquarius);

        // ✅ SORT PROPER ORDER
        capricorn.sort(
          (a, b) =>
            getCategoryOrder(a.Category) - getCategoryOrder(b.Category)
        );

        aquarius.sort(
          (a, b) =>
            getCategoryOrder(a.Category) - getCategoryOrder(b.Category)
        );

        console.log("✅ Capricorn:", capricorn.map(p => p.ProductName));
        console.log("✅ Aquarius:", aquarius.map(p => p.ProductName));

        setCapricornItems(capricorn);
        setAquariusItems(aquarius);
      })
      .catch(() => {
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* DETAILS */}
      <AnimatePresence>
        <motion.section className="moon-section" style={{ background: planet.bg }}>
          <Container>
            <Row className="align-items-center">
              <Col md={5}>
                <img src={planet.image} alt="saturn" className="moon-big-img" />
                <h2>{planet.name}</h2>
              </Col>
              <Col md={7}>
                <p>{planet.description}</p>
                <span>{planet.meta.energy}</span>
              </Col>
            </Row>
          </Container>
        </motion.section>
      </AnimatePresence>

      {/* PRODUCTS */}
      <section className="moon-products">
        <Container>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              {/* ✅ CAPRICORN FIRST */}
              <h3 className="mb-3">Capricorn</h3>
              <div className="product-grid">
                {capricornItems.map((product) => (
                  <NavLink key={product._id} to={`/productdetails/${product._id}`}>
                    <div className="product-card-moon">
                      <img
                        src={
                          product.Photos?.[0]?.startsWith("http")
                            ? product.Photos[0]
                            : `/images/${product.Photos?.[0]}`
                        }
                        alt={product.ProductName}
                        className="zodiac-product-img"
                      />
                      <div>
                        <span>{product.ProductName}</span>
                        <div>{product.size}</div>
                        <div>₹ {product.ProductPrice}</div>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>

              {/* SPACE */}
              <div style={{ height: "40px" }} />

              {/* ✅ AQUARIUS AFTER */}
              <h3 className="mb-3">Aquarius</h3>
              <div className="product-grid">
                {aquariusItems.map((product) => (
                  <NavLink key={product._id} to={`/productdetails/${product._id}`}>
                    <div className="product-card-moon">
                      <img
                        src={
                          product.Photos?.[0]?.startsWith("http")
                            ? product.Photos[0]
                            : `/images/${product.Photos?.[0]}`
                        }
                        alt={product.ProductName}
                        className="zodiac-product-img"
                      />
                      <div>
                        <span>{product.ProductName}</span>
                        <div>{product.size}</div>
                        <div>₹ {product.ProductPrice}</div>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
};

export default SaturnSection;