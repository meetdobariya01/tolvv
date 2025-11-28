import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Allfaqs from "../../components/faqs-Q&A/allfaqs";

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
          <h1 className="the-artisan-font">Faqs</h1>
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
            <Allfaqs />
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
