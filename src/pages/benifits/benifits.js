import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Benifits = () => {
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
        <img src="./images/benifits.png" alt="Hero" className="hero-image" />
      </motion.div>

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1 className="the-artisan-font">Benefits</h1>

          {/* Paragraph 1 */}
          <p
            className="mx-auto"
            style={{
              color: "#333",
              lineHeight: "1.8",
              fontSize: "16px",
            }}
          >
            Our Zodiac Collection blends luxurious skincare with the energy of
            your sign, creating a ritual that feels personally designed for you.
            Each soap, body lotion, bath gel, and perfume is infused with
            mood-enhancing aromas, skin-loving botanicals, and intention-driven
            formulations that resonate with your zodiac’s natural traits.
            Whether you’re a fiery Aries seeking invigorating freshness or a
            calm Pisces craving soothing hydration, every product aligns with
            the essence of your cosmic personality.
          </p>

          {/* Paragraph 2 */}
          <p
            className="mx-auto mt-4"
            style={{
              color: "#333",
              lineHeight: "1.8",
              fontSize: "16px",
            }}
          >
            These products don’t just nourish your skin; they elevate your
            spirit. Feel the difference as signature fragrances boost your mood,
            celestial ingredients restore balance, and your daily routine
            transforms into a grounding, empowering ritual. With every use,
            you’re not just caring for your body—you’re connecting with your
            inner energy, enhancing your aura, and celebrating the unique magic
            of your zodiac sign.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Benifits;
