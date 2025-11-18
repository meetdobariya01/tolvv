import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./category.css";

const Category = () => {
  const products = {
    "Bath Lotion": {
      title: "BATH LOTION",
      img1: "./images/product/body-lotion/virgo-body-lotion.jpg",
      img2: "./images/product/body-lotion-back.jpg",
      features: [
        { icon: "💧", text: "No Harmful Chemicals" },
        { icon: "🌿", text: "Paraben Free" },
        { icon: "🧴", text: "Skin Friendly" },
        { icon: "🐰", text: "Cruelty Free" },
      ],
      howToUse: "Apply lotion evenly across your skin and gently massage.",
      ingredients: "Aloe Vera, Shea Butter, Vitamin E, Natural Oils",
      caution: "Avoid eye contact. Store in cool, dry place.",
    },

    Soap: {
      title: "SOAP",
      img1: "./images/product/soap/leo-soap.jpg",
      img2: "./images/product/soap/sagittarius-soap.jpg",
      features: [
        { icon: "🧼", text: "Natural Oils" },
        { icon: "🌿", text: "Chemical Free" },
        { icon: "🍃", text: "Soft on Skin" },
        { icon: "🐰", text: "Cruelty Free" },
      ],
      howToUse: "Lather onto wet skin and rinse.",
      ingredients: "Coconut Oil, Vitamin E, Essential Oils",
      caution: "For external use only.",
    },

    "Essential Oil": {
      title: "ESSENTIAL OIL",
      img1: "./images/product/essential-oil/aquarius-essential-oil.jpg",
      img2: "./images/product/essential-oil/sagittarius-essential-oil.jpg",
      features: [
        { icon: "🌸", text: "Aromatherapy Grade" },
        { icon: "🌿", text: "100% Natural" },
        { icon: "💧", text: "Cold Pressed" },
        { icon: "🔥", text: "Stress Relief" },
      ],
      howToUse: "Use in diffuser or dilute with carrier oil.",
      ingredients: "Pure essential oil extract",
      caution: "Do not apply directly without dilution.",
    },

    Candle: {
      title: "CANDLE",
      img1: "/images/candle-1.jpg",
      img2: "/images/candle-2.jpg",
      features: [
        { icon: "🕯️", text: "Long Burning" },
        { icon: "🌸", text: "Aromatic Scents" },
        { icon: "♻️", text: "Eco-Friendly Wax" },
        { icon: "🔥", text: "Smokeless Flame" },
      ],
      howToUse: "Light wick and keep away from flammables.",
      ingredients: "Soy Wax, Fragrance Oils",
      caution: "Do not leave candle unattended.",
    },

    "Eau de Perfumes": {
      title: "EAU DE PERFUMES",
      img1: "./images/product/perfume/aquarius-perfume.jpg",
      img2: "./images/product/perfume/gemini-perfume.jpg",
      features: [
        { icon: "💐", text: "Long Lasting" },
        { icon: "🌿", text: "Skin Safe" },
        { icon: "✨", text: "Premium Notes" },
        { icon: "🐰", text: "Cruelty Free" },
      ],
      howToUse: "Spray on pulse points.",
      ingredients: "Alcohol Base, Natural Oils, Fragrance Mix",
      caution: "Avoid eyes. Keep away from flames.",
    },
  };

  const [activeProduct, setActiveProduct] = useState("Bath Lotion");
  const p = products[activeProduct];

  return (
    <div>
      <div className="product-wrapper">
        <Container>
          <Row>
            <Col md={6}>
              <div className="two-image-row fade-in">
                <div className="image-col">
                  <img src={p.img1} alt={p.title} />
                </div>

                <div className="image-col">
                  <img src={p.img2} alt={p.title} />
                </div>
              </div>
            </Col>

            <Col md={6}>
              <h2 className="product-title">{p.title}</h2>

              <div className="features-row">
                {p.features.map((f, i) => (
                  <div className="feature-box" key={i}>
                    <div className="feature-icon">{f.icon}</div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <h4 className="section-title">HOW TO USE</h4>
              <p className="section-text">{p.howToUse}</p>

              <h4 className="section-title">INGREDIENTS</h4>
              <p className="section-text">{p.ingredients}</p>

              <h4 className="section-title">CAUTION</h4>
              <p className="section-text">{p.caution}</p>
            </Col>
          </Row>

          <div className="category-tabs">
            {Object.keys(products).map((key) => (
              <div
                key={key}
                className={`category-tab ${
                  key === activeProduct ? "active" : ""
                }`}
                onClick={() => setActiveProduct(key)}
              >
                {key}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Category;
