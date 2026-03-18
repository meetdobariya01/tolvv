import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
// import Cookies from "js-cookie";
import {  NavLink } from "react-router-dom";
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
    name.toLowerCase().includes(zodiac.toLowerCase()),
  );
};
const planetData = [
  {
    name: "Moon",
    image: "./images/moon.png",
    mood: "Calm",
    bg: "#5F286E",
    description:
      "The King and the Great Father embody the archetypes of the Sun - the source of all light and life, both earthly and spiritual. The Sun uplifts and energizes, offering inspiration, balance and renewal. It rules over healthy self-esteem, life purpose, creativity, healing, and vitality, illuminating the path toward wholeness and strength.",
    meta: {
      energy: "Peaceful",
      colour: "Violet",
      element: "Water",
      rules: "Cancer",
    },
    zodiac: "Cancer",
  },
  {
    name: "Sun",
    image: "/images/sun.png",
    mood: "Energy",
    bg: "#D3B42B",
    description:
      "The King and the Great Father embody the archetype of the Sun - the radiant source of all light and life, both earthly and spiritual. The Sun stands as a symbol of inspiration, energy, and inner balance. It governs our sense of self-worth, purpose, creativity, healing, and the very vitality that sustains life itself.",
    meta: { energy: "Vitality", colour: "Gold", element: "Fire", rules: "Leo" },
    zodiac: "Leo",
  },
  {
    name: "Mercury",
    image: "/images/mercury.png",
    mood: "Clarity",
    bg: "#E6B222",
    description:
      "The Winged Messenger of the Gods, Mercury, serves as the vital bridge between the solar and lunar forces within us. Long revered as the archetype of duality and fluidity, Mercury represents the ancient source of non-binary thought and the seamless flow between masculine and feminine energies — both physical and energetic. In alchemy, Mercury is depicted as a being of perfect balance, half male and half female. It governs the realms of the mind — our thoughts, perceptions, intellect, connection, and communication.",
    meta: {
      energy: "Harmonizing",
      colour: "Orange",
      element: "Air",
      rules: "Gemini & Virgo",
    },
    zodiac: "Gemini & Virgo",
  },
  {
    name: "Venus",
    image: "/images/venus.png",
    mood: "Radiance",
    bg: "#04683F",
    description:
      "Venus embodies the divine desire for self-renewal and the innate love of beauty within us. She is the inner Artist — the force that transforms both self and world through love, aesthetics, and creative expression. Venus invites us to cultivate connection — whether through our relationship with nature and the material world, as reflected in Taurus, or through harmony, culture, and human connection, as expressed through Libra.",
    meta: {
      energy: "Loveing",
      colour: "Green",
      element: "Air",
      rules: "Taurus & Libra",
    },
    zodiac: "Taurus & Libra",
  },
  {
    name: "Mars",
    image: "/images/mars.png",
    mood: "Passion",
    bg: "#A72024",
    description:
      "Mars, the Proud Warrior, embodies the spirit of courage and the fire of empowerment within us all. It represents our capacity for action — our passion, daring, and strength of will. As ruler of Aries, Mars governs the formation and expression of self-identity, while its co-rulership with Pluto over Scorpio speaks to the deeper process of transformation — the continual rebirth of the self through challenge and change.",
    meta: {
      energy: "Empowering",
      colour: "Red",
      element: "Fire",
      rules: "Aries & Scorpio",
    },
    zodiac: "Aries & Scorpio",
  },
  {
    name: "Jupiter",
    image: "/images/jupiter.png",
    mood: "Optimism",
    bg: "#303188",
    description:
      "Jupiter, the beloved Wise Man of the cosmos and our inner world, governs faith, wisdom, and the shared values that shape culture and society. As the ruler of philosophy and spiritual exploration, Jupiter invites us to seek meaning — to question who we are, why we are here, and how we might expand our consciousness through knowledge, belief, and experience.",
    meta: {
      energy: "Expansiveness",
      colour: "Blue",
      element: "Fire",
      rules: "Sagittarius & Pisces",
    },
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
  const [activePlanet, setActivePlanet] = useState("null");
  const [planetProducts, setPlanetProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  // const token = localStorage.getItem("token");

  const planet = planetData.find((p) => p.name === activePlanet);

  // Fetch products for the selected planet
  useEffect(() => {
    if (!planet?.zodiac) return;
    setLoading(true);

    const zodiacs = planet.zodiac.split("&").map((z) => z.trim());

    Promise.all(
      zodiacs.map((zodiac) =>
        axios
          .get(`${API_URL}/products/zodiac/${zodiac}`)
          .then((res) => res.data),
      ),
    )
      .then((results) => setPlanetProducts(results.flat()))
      .catch((err) => {
        console.error(err);
        setPlanetProducts([]);
      })
      .finally(() => setLoading(false));
  }, [planet]);

  // Buy Now logic (same as Zodiac section)
  // const handleBuyNow = async (product) => {
  //   if (!product) return;

  //   if (token) {
  //     // Logged-in user
  //     try {
  //       await axios.post(
  //         `${API_URL}/cart/add`,
  //         { productId: product._id, quantity: 1 },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       navigate("/cart");
  //     } catch (error) {
  //       console.error("Add to cart error:", error.response || error);
  //       if (error.response?.status === 401) {
  //         alert("Session expired. Please login again.");
  //         localStorage.removeItem("token");
  //         navigate("/login");
  //       }
  //     }
  //   } else {
  //     // Guest user
  //     let cart = [];
  //     try {
  //       const stored = Cookies.get("guestCart");
  //       cart = stored ? JSON.parse(stored) : [];
  //       if (!Array.isArray(cart)) cart = [];
  //     } catch {
  //       cart = [];
  //     }

  //     const existing = cart.find((item) => item.productId === product._id);
  //     if (existing) existing.quantity += 1;
  //     else
  //       cart.push({
  //         type: "product",
  //         productId: product._id,
  //         quantity: 1,
  //         price: product.ProductPrice,
  //         name: product.ProductName,
  //         img: product.Photos,
  //       });

  //     Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
  //     navigate("/cart");
  //   }
  // };

  return (
    <>
      {/* PLANET SELECTOR */}
      <section className="planet-section">
        <Container>
          <h2 className="planet-heading sora">EXPLORE BY YOUR RULING PLANET</h2>
          <Row className="justify-content-center moon-planet">
            {planetData.map((p, i) => (
              <Col
                key={i}
                xs={4}
                sm={3}
                md={1}
                className="text-center planet-item"
              >
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

      {/* PLANET DETAILS */}
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

                    {/* <p className="moon-big-title gt-super text-uppercase">
                      {planet.name}
                    </p> */}
                  </div>
                </Col>
                <Col
                  md={7}
                  className="moon-right d-flex justify-content-center flex-column"
                >
                  <div className="">
                    <p className="moon-description sora">
                      {planet.description}
                    </p>

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

      {/* PRODUCTS */}
      {planet && (
        <section className="moon-products sora">

          <Container>
            {loading ? (
              <p>Loading products...</p>
            ) : planetProducts.length === 0 ? (
              <p>No products found for {planet.name}</p>
            ) : (
              <div className="product-grid">
                {planetProducts.map((product) => (
                  <NavLink
                    to={`/productdetails/${product._id}`}
                    className="text-decoration-none text-dark"
                    key={product._id}
                  >
                    <div className="product-card p-1">
                      <div className="product-box-zodiac">
                        <img
                          src={`${product.Photos}`}
                          alt={product.ProductName}
                          className="zodiac-product-img"
                        />
                        <div className="product-info">
                          <p className="name">
                            {product.ProductName} <span>›</span>
                          </p>
                          {/* <p className="size">{product.size}</p> */}
                          <div className="price-with-dot">
                            <span
                              className="planet-dot"
                              style={{
                                backgroundColor:
                                  zodiacColors[
                                  getZodiacFromProduct(product.ProductName)
                                  ] || planet.color,
                              }}
                              title={getZodiacFromProduct(product.ProductName)}
                            ></span>

                            <span className="zodiac-price">
                              ₹{product.ProductPrice}
                            </span>
                          </div>
                          <div className="underline" />
                          <p className="size">{product.size}</p>
                          {/* <button
                          className="btn btn-outline-dark mt-1"
                          onClick={() => handleBuyNow(product)}
                        >
                          Buy Now
                        </button> */}
                        </div>
                      </div>
                    </div>
                    </NavLink>
                  ))}
                  </div>
                )}
              </Container>
          </section>
      )}
    </>
  );
};

export default Moonsection;
