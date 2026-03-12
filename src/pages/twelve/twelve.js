

// import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Zodic from "../Zodiacs/zodics";
import "./twelve.css";
import Moonsection from "../../components/moonsection/moonsection";

const Twelve = () => {
  return (
    <div>
      {/* HEADER */}
      <Header />

      <section className="zodiac-hero">
        <motion.img
          src="/images/bg.png" // 👈 your banner image
          alt="Hero Banner"
          className="zodiac-hero-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      {/* ZODIAC COMPONENT */}
      <Zodic />

      {/* <section className="zodiac-quote-section">
        <div className="zodiac-quote-text">
          Like us, plants are guided by cosmic energies. Their essential oils
          carry these forces from above to earth, helping you align with
          astrological energies and transform your life. Step into your
          radiance—become the star you are.
        </div>

        <div className="zodiac-divider">
          <span className="zodiac-line" />
          <span className="zodiac-star">✦</span>
          <span className="zodiac-line" />
        </div>
      </section> */}

      <Moonsection />
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Twelve;
