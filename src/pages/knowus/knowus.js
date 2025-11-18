import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Knowus = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <motion.div
        className="hero-image-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src="./images/know-us.jpg" alt="Hero" className="hero-image" />
      </motion.div>

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1
            className="fw-light mb-5"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "70px",
              color: "#000",
            }}
          >
            Know Us
          </h1>

          {/* Row */}
          <div className="row align-items-center justify-content-center">
            {/* Left Image */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4 mb-lg-0">
              <img
                src="./images/knowus-girl.jpg"
                alt="Founders"
                className="img-fluid rounded shadow"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Right Text */}
            <div className="col-lg-6 col-md-10 col-sm-12 text-center text-lg-start">
              <h2
                className="fw-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                }}
              >
                ADITI & NEHA
              </h2>

              <p style={{ color: "#333", lineHeight: "1.8" }}>
                We’re Neha and Aditi, kindred souls on a shared path.
              </p>
              <p style={{ color: "#333", lineHeight: "1.8" }}>
                United by more than friendship, a spiritual journey that has
                guided every step of our lives. A bond beyond emotions, founded
                on connection, spirituality, and the subtle guidance of the
                universe.
              </p>
              <p style={{ color: "#333", lineHeight: "1.8" }}>
                Together, we discovered a shared passion for zodiac, the energy
                of the signs, and the spiritual rhythm that flows through
                everything around us.
              </p>
              <p style={{ color: "#333", lineHeight: "1.8" }}>
                This passion inspired us to start our personalised bath and body
                brand, a space where signs meet science, where every product
                resonates with the unique energy of the 12 sun signs.
              </p>
              <p style={{ color: "#333", lineHeight: "1.8" }}>
                Each item is crafted with intention, care, and love, so you can
                experience self-care that’s deeply personal, and aligned with
                your cosmic energy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center text-lg-start">
            {/* Left Text Section */}
            <div className="col-lg-6 col-md-10 col-sm-12 mb-4 mb-lg-0">
              <h2
                className="fw-bold mb-4 text-center text-lg-start"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                  color: "#000",
                }}
              >
                WHAT IS TOLVV?
              </h2>

              <p style={{ color: "#333", lineHeight: "1.8", fontSize: "15px" }}>
                Tolvv is inspired by the twelve sun signs — the cosmic forces
                that shape our emotions, energy, and essence. Since ancient
                times, the alignment of the sun, moon, and planets has guided
                us, revealing how the universe influences our lives and
                well-being.
              </p>

              <p style={{ color: "#333", lineHeight: "1.8", fontSize: "15px" }}>
                At Tolvv, we’ve reimagined this ancient wisdom into a modern
                skincare experience, where the mind, body, and soul come into
                alignment. Each product is thoughtfully crafted to reflect the
                unique energy of the zodiac, helping you nurture your emotional,
                physical, and spiritual balance through everyday rituals.
              </p>

              <p style={{ color: "#333", lineHeight: "1.8", fontSize: "15px" }}>
                These are more than skincare essentials — they are reflections
                of you, designed to help you glow from within, in harmony with
                the cosmos.
              </p>
            </div>

            {/* Right Image Section */}
            <div className="col-lg-5 col-md-8 col-sm-10 text-center">
              <img
                src="./images/bath-gel.jpg"
                alt="Tolvv Product"
                className="img-fluid rounded shadow"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </div>

        {/* Footer Section */}
        <Footer/>
    </div>
  );
};

export default Knowus;
