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

const getZodiacFromProduct = (name) => {
  if (!name) return null;
  return Object.keys(zodiacColors).find((zodiac) =>
    name.toLowerCase().includes(zodiac.toLowerCase())
  );
};

const planetData = [
  {
    name: "Moon",
    image: "./images/moon.png",
    mood: "Calm",
    bg: "#5F286E",
    description: "The King and the Great Father embody the archetypes of the Sun - the source of all light and life, both earthly and spiritual. The Sun uplifts and energizes, offering inspiration, balance and renewal. It rules over healthy self-esteem, life purpose, creativity, healing, and vitality, illuminating the path toward wholeness and strength.",
    meta: { energy: "Peaceful", colour: "Violet", element: "Water", rules: "Cancer" },
    zodiac: "Cancer",
  },
  {
    name: "Sun",
    image: "/images/sun.png",
    mood: "Energy",
    bg: "#D3B42B",
    description: "The King and the Great Father embody the archetype of the Sun - the radiant source of all light and life, both earthly and spiritual. The Sun stands as a symbol of inspiration, energy, and inner balance. It governs our sense of self-worth, purpose, creativity, healing, and the very vitality that sustains life itself.",
    meta: { energy: "Vitality", colour: "Gold", element: "Fire", rules: "Leo" },
    zodiac: "Leo",
  },
  {
    name: "Mercury",
    image: "/images/mercury.png",
    mood: "Clarity",
    bg: "#E6B222",
    description: "The Winged Messenger of the Gods, Mercury, serves as the vital bridge between the solar and lunar forces within us. Long revered as the archetype of duality and fluidity, Mercury represents the ancient source of non-binary thought and the seamless flow between masculine and feminine energies — both physical and energetic.",
    meta: { energy: "Harmonizing", colour: "Orange", element: "Air", rules: "Gemini & Virgo" },
    zodiac: "Gemini & Virgo",
  },
  {
    name: "Venus",
    image: "/images/venus.png",
    mood: "Radiance",
    bg: "#04683F",
    description: "Venus embodies the divine desire for self-renewal and the innate love of beauty within us. She is the inner Artist — the force that transforms both self and world through love, aesthetics, and creative expression.",
    meta: { energy: "Loving", colour: "Green", element: "Air", rules: "Taurus & Libra" },
    zodiac: "Taurus & Libra",
  },
  {
    name: "Mars",
    image: "/images/mars.png",
    mood: "Passion",
    bg: "#A72024",
    description: "Mars, the Proud Warrior, embodies the spirit of courage and the fire of empowerment within us all. It represents our capacity for action — our passion, daring, and strength of will.",
    meta: { energy: "Empowering", colour: "Red", element: "Fire", rules: "Aries & Scorpio" },
    zodiac: "Aries & Scorpio",
  },
  {
    name: "Jupiter",
    image: "/images/jupiter.png",
    mood: "Optimism",
    bg: "#303188",
    description: "Jupiter, the beloved Wise Man of the cosmos and our inner world, governs faith, wisdom, and the shared values that shape culture and society.",
    meta: { energy: "Expansiveness", colour: "Blue", element: "Fire", rules: "Sagittarius & Pisces" },
    zodiac: "Sagittarius & Pisces",
  },
  {
    name: "Saturn",
    image: "/images/saturn.png",
    mood: "Wisdom",
    bg: "#211F1B",
    description:
      "The Wise Elder Woman of the cosmos and our inner world, she guides us toward profound self-knowledge through direct experience with Source. Her teachings are rooted in silence, discipline, time, and a grounded connection to reality. She embodies the art of boundaries and the practice of self-mastery — inviting us to cultivate inner strength, discipline, and the refinement of our skills and spirit.",
    meta: {
      energy: "Wisdom, Mastery",
      colour: "Black",
      element: "Earth",
      rules: "Capricorn & Aquarius",
    },
    zodiac: "Capricorn & Aquarius",
  },
];

const Moonsection = () => {
  const [activePlanet, setActivePlanet] = useState("Saturn");
  const [planetProducts, setPlanetProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const planet = planetData.find((p) => p.name === activePlanet);

  // Helper function to get sort order for a product
  const getSortOrder = (product) => {
    const name = product.ProductName.toLowerCase();
    
    // Determine zodiac order (0 for first zodiac, 1 for second)
    let zodiacOrder = 0;
    if (name.includes("capricorn")) zodiacOrder = 0;
    else if (name.includes("aquarius")) zodiacOrder = 1;
    else if (name.includes("aries")) zodiacOrder = 0;
    else if (name.includes("scorpio")) zodiacOrder = 1;
    else if (name.includes("gemini")) zodiacOrder = 0;
    else if (name.includes("virgo")) zodiacOrder = 1;
    else if (name.includes("taurus")) zodiacOrder = 0;
    else if (name.includes("libra")) zodiacOrder = 1;
    else if (name.includes("leo")) zodiacOrder = 0;
    else if (name.includes("cancer")) zodiacOrder = 0;
    else if (name.includes("sagittarius")) zodiacOrder = 0;
    else if (name.includes("pisces")) zodiacOrder = 1;
    
    // Determine category order
    let categoryOrder = 99;
    if (name.includes("bath gel")) categoryOrder = 0;
    else if (name.includes("body lotion")) categoryOrder = 1;
    else if (name.includes("perfume")) categoryOrder = 2;
    else if (name.includes("essential oil")) categoryOrder = 3;
    else if (name.includes("soap")) categoryOrder = 4;
    else if (name.includes("hamper")) categoryOrder = 5;
    
    // Return combined sort key: zodiacOrder * 100 + categoryOrder
    return (zodiacOrder * 100) + categoryOrder;
  };

  useEffect(() => {
    if (!planet?.zodiac) return;
    setLoading(true);

    const zodiacs = planet.zodiac.split("&").map((z) => z.trim());

    Promise.all(
      zodiacs.map((zodiac) =>
        axios.get(`${API_URL}/products/zodiac/${zodiac}`).then((res) => res.data)
      )
    )
      .then((results) => {
        let combinedProducts = results.flat();

        const uniqueProducts = Array.from(
          new Map(combinedProducts.map((item) => [item._id, item])).values()
        );

        // Sort using the getSortOrder function
        const sortedProducts = [...uniqueProducts].sort((a, b) => {
          return getSortOrder(a) - getSortOrder(b);
        });

        setPlanetProducts(sortedProducts);
      })
      .catch((err) => {
        console.error("Error fetching planet products:", err);
        setPlanetProducts([]);
      })
      .finally(() => setLoading(false));
  }, [planet]);

  const getProductColor = (product) => {
    const name = product.ProductName;
    const productZodiac = getZodiacFromProduct(name);
    return zodiacColors[productZodiac] || "#CCC29F";
  };

  return (
    <>
      {/* PLANET SELECTOR SECTION */}
      <section className="planet-section">
        <Container>
          <h2 className="planet-heading sora">EXPLORE BY YOUR RULING PLANET</h2>
          <Row className="justify-content-center moon-planet">
            {planetData.map((p, i) => (
              <Col key={i} xs={2} sm={3} md={1} className="text-center planet-item">
                <motion.div
                  className={`planet-circle ${activePlanet === p.name ? "active" : ""}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePlanet(p.name)}
                >
                  <img src={p.image} alt={p.name} className="planet-img" />
                </motion.div>
                <p className="planet-name sora mt-4">{p.name}</p>
                <div className="planet-arrow"></div>
                <span className="planet-mood sora">{p.mood}</span>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* PLANET DETAILS SECTION */}
      {planet && (
        <AnimatePresence mode="wait">
          <motion.section
            key={planet.name}
            className="moon-section"
            style={{ background: planet.bg }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Container>
              <Row className="align-items-center moon-layout">
                <Col md={5} className="moon-left">
                  <div className="moon-visual">
                    <motion.img
                      src={planet.image}
                      alt={planet.name}
                      className="moon-big-img shadow-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <p className="moon-big-title gt-super text-uppercase">
                      {planet.name}
                    </p>
                  </div>
                </Col>
                <Col md={7} className="moon-right d-flex justify-content-center flex-column">
                  <div className="">
                    <p className="moon-description sora">{planet.description}</p>
                    <div className="moon-meta sora">
                      <span>Astral Energy : {planet.meta.energy}</span>
                      <span>Colour : {planet.meta.colour}</span>
                      <span>Element : {planet.meta.element}</span>
                      <span>Rules : {planet.meta.rules}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </motion.section>
        </AnimatePresence>
      )}

      {/* PRODUCTS SECTION */}
      {planet && (
        <section className="moon-products sora">
          <Container>
            {loading ? (
              <p>Loading products...</p>
            ) : planetProducts.length === 0 ? (
              <p>No products found for {planet.name}</p>
            ) : (
              <div className="product-grid">
                {planetProducts.map((product) => {
                  const dotColor = getProductColor(product);
                  
                  return (
                    <NavLink
                      to={`/productdetails/${product._id}`}
                      className="text-decoration-none text-dark"
                      key={product._id}
                    >
                      <div className="product-card p-1">
                        <div className="product-box-zodiac">
                          <img
                            src={
                              product.Photos?.[0]?.startsWith("http")
                                ? product.Photos[0]
                                : `/images/${product.Photos?.[0]?.replace("images/", "")}`
                            }
                            alt={product.ProductName}
                            className="zodiac-product-img"
                          />
                          <div className="product-info">
                            <div className="price-with-dot-1">
                              <span
                                className="zodiac-dot"
                                style={{ backgroundColor: dotColor }}
                              ></span>
                              <span className="name fw-bolder">
                                {product.ProductName} <span>›</span>
                              </span>
                            </div>
                            <div className="underline" />
                            <div className="size-price-row">
                              <span className="size">{product.size || ""}</span>
                              <span className="zodiac-price">₹ {product.ProductPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  );
};

export default Moonsection;