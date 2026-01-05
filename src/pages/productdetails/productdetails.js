import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "./productdetails.css";

const products = [
  {
    id: 1,
    name: "ARIES BATH GEL",
    size: "200 ml",
    image: "/images/bath-gel.png",
    hero: "/images/hero.jpg",
    usage:
      "Wet your skin, then work a small amount into a rich lather using your hands. Gently massage over your body and rinse thoroughly.",
    ingredients:
      "Natural Aloe Extract, Vitamin E, Castor Oil, Coconut Oil, Glycerin.",
    icons: ["No Harmful Chemicals", "Paraben Free", "Skin Friendly", "Cruelty Free"],
  },
];


const Productdetails = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <div>
      {/* ================= PRODUCT LIST ================= */}
      {!selectedProduct && (
        <Container className="py-5">
          <Row>
            {products.map((item) => (
              <Col md={4} key={item.id}>
                <Card
                  className="product-card"
                  onClick={() => setSelectedProduct(item)}
                >
                  <Card.Img src={item.image} />
                  <Card.Body>
                    <h6>{item.name}</h6>
                    <p>{item.size}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* ================= PRODUCT DETAILS ================= */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* HERO */}
            <section
              className="product-hero"
              style={{ backgroundImage: `url(${selectedProduct.hero})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-text">
                <h1>CELESTIAL CARE</h1>
                <p>Crafted for your skin’s glow.</p>
              </div>
            </section>

            {/* DETAILS */}
            <Container className="py-5">
              <Row>
                <Col md={5}>
                  <motion.img
                    src={selectedProduct.image}
                    className="detail-img"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                  />
                </Col>

                <Col md={7}>
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2>{selectedProduct.name}</h2>

                    <div className="icon-row">
                      {selectedProduct.icons.map((i, idx) => (
                        <span key={idx}>{i}</span>
                      ))}
                    </div>

                    <h6>HOW TO USE</h6>
                    <p>{selectedProduct.usage}</p>

                    <h6>INGREDIENTS</h6>
                    <p>{selectedProduct.ingredients}</p>

                    <button
                      className="back-btn"
                      onClick={() => setSelectedProduct(null)}
                    >
                      ← Back to Products
                    </button>
                  </motion.div>
                </Col>
              </Row>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Productdetails;
