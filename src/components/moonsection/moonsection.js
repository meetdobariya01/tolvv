import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./moonsection.css";

const planetData = [
  {
    name: "Moon",
    color: "#4b1e5d",
    mood: "Calm",
    bg: "#5b2a6d",
    description:
      "The King and the Great Father embody the archetypes of the Sun—the source of all light and life, both earthly and spiritual. The Sun uplifts and energizes, offering inspiration, balance and renewal. It rules over healthy self-esteem, life purpose, creativity, healing, and vitality, illuminating the path toward wholeness and strength.",
    meta: { energy: "Peaceful", colour: "Violet", element: "Water", rules: "Cancer" },
    zodiac: "Cancer",
  },
  {
    name: "Sun",
    color: "#d4af37",
    mood: "Energy",
    bg: "#7a5a12",
    description:
      "The King and the Great Father embody the archetype of the Sun — the radiant source of all light and life, both earthly and spiritual. The Sun stands as a symbol of inspiration, energy, and inner balance. It governs our sense of self-worth, purpose, creativity, healing, and the very vitality that sustains life itself.",
    meta: { energy: "Vitality", colour: "Gold", element: "Fire", rules: "Leo" },
    zodiac: "Leo",
  },
  {
    name: "Mercury",
    color: "#e0a31c",
    mood: "Clarity",
    bg: "#8a5f12",
    description:
      "The Winged Messenger of the Gods, Mercury, serves as the vital bridge between the solar and lunar forces within us. Long revered as the archetype of duality and fluidity, Mercury represents the ancient source of non-binary thought and the seamless flow between masculine and feminine energies — both physical and energetic. In alchemy, Mercury is depicted as a being of perfect balance, half male and half female. It governs the realms of the mind — our thoughts, perceptions, intellect, connection, and communication.",
    meta: { energy: "Harmonizing", colour: "Orange", element: "Air", rules: "Gemini & Virgo" },
    zodiac: "Gemini",
  },
  {
    name: "Venus",
    color: "#0f5c3b",
    mood: "Radiance",
    bg: "#144d38",
    description:
      "Venus embodies the divine desire for self-renewal and the innate love of beauty within us. She is the inner Artist — the force that transforms both self and world through love, aesthetics, and creative expression. Venus invites us to cultivate connection — whether through our relationship with nature and the material world, as reflected in Taurus, or through harmony, culture, and human connection, as expressed through Libra.",
    meta: {
      energy: "Loveing",
      colour: "Green",
      element: "Air",
      rules: "Taurus & Libra",
    },
  },
  {
    name: "Mars",
    color: "#a11b1b",
    mood: "Passion",
    bg: "#6e1515",
    description:
      "Mars, the Proud Warrior, embodies the spirit of courage and the fire of empowerment within us all. It represents our capacity for action — our passion, daring, and strength of will. As ruler of Aries, Mars governs the formation and expression of self-identity, while its co-rulership with Pluto over Scorpio speaks to the deeper process of transformation — the continual rebirth of the self through challenge and change.",
    meta: {
      energy: "Empowering",
      colour: "Red",
      element: "Fire",
      rules: "Aries & Scorpio",
    },
  },
  {
    name: "Jupiter",
    color: "#2c2f8f",
    mood: "Optimism",
    bg: "#1f226b",
    description:
      "Jupiter, the beloved Wise Man of the cosmos and our inner world, governs faith, wisdom, and the shared values that shape culture and society. As the ruler of philosophy and spiritual exploration, Jupiter invites us to seek meaning — to question who we are, why we are here, and how we might expand our consciousness through knowledge, belief, and experience.",
    meta: { energy: "Expansiveness", colour: "Blue", element: "Fire", rules: "Sagittarius" },
    zodiac: "Sagittarius",
  },
  {
    name: "Saturn",
    color: "#000",
    mood: "Wisdom",
    bg: "#1a1a1a",
    description:
      "The Wise Elder Woman of the cosmos and our inner world, she guides us toward profound self-knowledge through direct experience with Source. Her teachings are rooted in silence, discipline, time, and a grounded connection to reality. She embodies the art of boundaries and the practice of self-mastery — inviting us to cultivate inner strength, discipline, and the refinement of our skills and spirit.",
    meta: { energy: "Wisdom, Mastery", colour: "Black", element: "Earth", rules: "Capricorn" },
    zodiac: "Capricorn",
  },
];

const Moonsection = () => {
  const [activePlanet, setActivePlanet] = useState("Moon");
  const [planetProducts, setPlanetProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const planet = planetData.find((p) => p.name === activePlanet);

  // Fetch products whenever the planet changes
  useEffect(() => {
    if (!planet?.zodiac) return;
    setLoading(true);

    axios
      .get(`http://localhost:4000/products/zodiac/${planet.zodiac}`)
      .then((res) => setPlanetProducts(res.data))
      .catch((err) => {
        console.error(err);
        setPlanetProducts([]);
      })
      .finally(() => setLoading(false));
  }, [planet]);

  return (
    <>
      {/* 🌍 PLANET SELECTOR */}
      <section className="planet-section">
        <Container>
          <h2 className="planet-heading">EXPLORE BY YOUR RULING PLANET</h2>

          <Row className="justify-content-center moon-planet">
            {planetData.map((p, i) => (
              <Col
                key={i}
                xs={4}
                sm={3}
                md={1}
                className="text-center planet-item "
              >
                <motion.div
                  className={`planet-circle ${activePlanet === p.name ? "active" : ""}`}
                  style={{ background: p.color }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePlanet(p.name)}
                />
                <p className="planet-name">{p.name}</p>
                <div className="planet-arrow"></div>
                <span className="planet-mood">{p.mood}</span>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🌙 PLANET DETAIL */}
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
              {/* LEFT – CIRCLE + TITLE */}
              <Col md={5} className="moon-left">
                <div className="moon-visual">
                  <div className="moon-big-circle" style={{ background: planet.color }} />
                  <h1 className="moon-big-title">{planet.name}</h1>
                </div>
              </Col>

              {/* RIGHT – TEXT */}
              <Col md={7} className="moon-right">
                <p className="moon-description">{planet.description}</p>
                <p className="moon-description inter">{planet.description}</p>

              </Col>
            </Row>
          </Container>
        </motion.section>
      </AnimatePresence>

      {/* 🧴 PRODUCTS */}
      <section className="moon-products">
        <Container>
          {loading ? (
            <p>Loading products...</p>
          ) : planetProducts.length === 0 ? (
            <p>No products found for {planet.name}</p>
          ) : (
            <Row>
              {planetProducts.map((item) => (
                <Col xs={6} md={4} key={item._id}>
                  <motion.div
                    className="product-box"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <img
                      src={`http://localhost:4000${item.Photos}`}
                      alt={item.ProductName}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <h4>{item.ProductName}</h4>
                    <p>Price: ₹{item.ProductPrice}</p>
                    <p>Category: {item.Category}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Moonsection;
