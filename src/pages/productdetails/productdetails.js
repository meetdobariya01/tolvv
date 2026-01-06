import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import  "./productdetails.css";

const products = {
  bath: {
    title: " BATH GEL",
    icons: [
      "No Harmful Chemicals",
      "Paraben Free",
      "Skin Friendly",
      "Cruelty Free",
    ],
    howToUse:
      "Wet your skin, then work a small amount of 12’s Bath Gel into a lather using a loofah or your hands. Gently massage over your body, rinse thoroughly and pat dry. For extra soft skin, follow up with 12’s Body Lotion.",
    ingredients:
      "Natural Foam Booster, Natural Essential Oil, Glycerin, Vitamin E, Vitamin C, Castor Oil, Coconut Oil, Energized Water, Aries’s Seven Senses Fragrance",
    caution:
      "Avoid eye contact. In case of contact, rinse immediately with water. Store in a cool, dry place, away from direct sunlight.",
  },
  soap: {
    title: " SOAP",
    icons: ["Natural Oils", "Paraben Free", "Skin Safe", "Vegan"],
    howToUse:
      "Rediscover purity in every wash. Gentle ingredients inspired by nature, free from harshness, invite you back to simplicity. Let your skin breathe as you embrace a cleaner, more mindful approach to daily care.",
    ingredients:
      "Natural Foam Boosters, Coconut Oil, Glycerin, Castor Oil, Natural Essential Oil, Vitamin C, Energized Water, Aries’s Seven Senses Fragnance",
    caution:
      "Avoid eye contact. In case of contact, rinse immediately with water. Discontinue use if irritation occurs. Store in a cool, dry place. Keep out of reach of children.",
  },
  oil: {
    title: "ESSENTIAL OIL",
    icons: ["Pure Oil", "No Additives", "Therapeutic", "Cruelty Free"],
    howToUse:
      "12’s Essential Oil is best used in three ways-by inhaling through a diffuser, applying on your skin after mixing with a carrier oil or adding to your bath after proper dilution..",
    // ingredients: "100% Pure Essential Oil Extracts.",
    caution:
      "Always dilute essential oils before use. Avoid eye contact. In case of contact, rinse immediately with water. Do not ingest. Keep away from children. Some oils can cause skin irritation or sun sensitivity, so do a patch and test before use.",
  },
  eaudeperfumes: {
    title: "EAU DE PERFUMES",
    icons: ["Natural Oils", "Paraben Free", "Skin Safe", "Vegan"],
    howToUse:
      "12’s Perfumes are Designed for Gentle Elegance, Safe for Daily Wear and Mindful Living, Crafted to make You Feel Good - Inside and Out. Each Fragrance is a Harmonious Blend of Nature and Artistry, Created to Align with Your Sun Sign, to Uplift Your Spirit and Soothe Your Senses..",
    ingredients:
      "Denatured Spirit, Aquarius QS, Aromatic Substances, Dipropylene Glycol, Quantum Satis",
    caution:
      "Avoid Eye Contact. In Case of Contact, Rinse Immediately with Water. If Irritation persists, Discontinue Use. Keep Away from Heat, Flame and Direct Sunlight. Store in a Cool, Dry Place. Keep Out of Reach of Children. This Product is Flammable.",
  },
  bodylotion: {
    title: "BODY LOTION",
    icons: ["Pure Oil", "No Additives", "Therapeutic", "Cruelty Free"],
    howToUse:
      "12's Body Lotion is best when applied on slightly damp skin. Gently massage in upward circular motions until fully absorbed. Let the luxurious formula nourish your skin, leaving it soft, smooth and lightly fragranced. Use daily for a radiant and healthy glow. Combine with 12's Body Gel & feel the love.",
    ingredients:
      "1Glycerin, DMC, PEG Stearate, C12-15, Aloe Vera Extract, Honey, Vitamin E Acetate, Shea Butter, Beta Vulgaris, Jojoba Seed Oil, Olive Oil, Hyaluronic Acid, Fragrance, Aqua",
    caution:
      "Avoid eye contact. In case of contact, rinse immediately with water. Store in a cool, dry place, away from direct sunlight.",
  },
};

const Productdetails = () => {
  const [active, setActive] = useState("bath");

  return (
    <div>
      <Header />
      <section className="zodiac-hero">
        <motion.img
          src="/images/tolvv.jpg" // 👈 your banner image
          alt="Hero Banner"
          className="zodiac-hero-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      <Container fluid className="py-5 container">
        <Row className="align-items-start">
          {/* LEFT IMAGE GALLERY */}
          <Col md={6} className="d-flex gap-4">
            <motion.img
              src="/images/front.png"
              className="product-img"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            />
            <motion.img
              src="/images/back.png"
              className="product-img"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            />
          </Col>

          {/* RIGHT CONTENT */}
          <Col md={6}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="mb-3">{products[active].title}</h2>

                <div className="icon-row mb-4">
                  {products[active].icons.map((i, index) => (
                    <span key={index} className="icon-box">
                      {i}
                    </span>
                  ))}
                </div>

                <h6>HOW TO USE</h6>
                <p>{products[active].howToUse}</p>

                <h6>INGREDIENTS</h6>
                <p>{products[active].ingredients}</p>

                <h6>CAUTION</h6>
                <p>{products[active].caution}</p>

                <button className="add-btn btn btn-outline-dark">
                  ADD TO CART
                </button>
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>

        <hr />
        {/* PRODUCT SWITCHER */}
        <Row className="mt-5 text-center">
          {[
            { key: "bath", label: "BATH LOTION" },
            { key: "soap", label: "SOAP" },
            { key: "oil", label: "ESSENTIAL OIL" },
            { key: "eaudeperfumes", label: "EAU DE PERFUMES" },
            { key: "bodylotion", label: "BATH GEL" },
          ].map((item) => (
            <Col xs={4} md={2} key={item.key}>
              <span
                className={`product-link ${
                  active === item.key ? "active" : ""
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </span>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Productdetails;
