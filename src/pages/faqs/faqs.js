import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Faqs = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* FAQ Content Section */}
      <motion.div
        className="hero-image-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src="./images/faqs.png" alt="Hero" className="hero-image" />
      </motion.div>

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Header */}
          <h1 className="the-artisan-font">
            Faqs
          </h1>
          <h5
            className="mb-4"
            style={{
              fontSize: "16px",
              letterSpacing: "1px",
              color: "#000",
              textTransform: "uppercase",
            }}
          >
            QUESTIONS YOU MAY HAVE
          </h5>

          {/* Description */}
          <p
            className="text-center mx-auto"
            style={{
              maxWidth: "800px",
              color: "#333",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            We've picked our most frequently asked questions. Here you can find
            out the information you are interested in.
          </p>

          {/* FAQ List */}
          <div
            className="text-start mt-5 mx-auto"
            style={{ maxWidth: "800px", fontSize: "15px", color: "#000" }}
          >
            <hr />
            <p>
              1. What makes your self-care products different from others in the
              market?
            </p>
            <hr />
            <p>2. Are your products natural, organic, or cruelty-free?</p>
            <hr />
            <p>3. Are your products dermatologically or clinically tested?</p>
            <hr />
            <p>4. Where do you source your ingredients from?</p>
            <hr />
            <p>5. Are your products safe for sensitive skin?</p>
            <hr />
            <p>6. Where can I buy your products – online or in store?</p>
            <hr />
            <p>7. Do you ship internationally?</p>
            <hr />
            <p>8. What is your return or exchange policy?</p>
            <hr />
            <p>9. Are they suitable for men, women, and teenagers alike?</p>
            <hr />
            <p>10. Are your products safe during pregnancy or breastfeeding?</p>
            <hr />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Faqs;
