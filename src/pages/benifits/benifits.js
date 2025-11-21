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
          <h1 className="the-artisan-font">
            Benefits
          </h1>

          {/* Paragraph 1 */}
          <p
            className="mx-auto"
            style={{
              maxWidth: "900px",
              color: "#333",
              lineHeight: "1.8",
              fontSize: "16px",
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>

          {/* Paragraph 2 */}
          <p
            className="mx-auto mt-4"
            style={{
              maxWidth: "900px",
              color: "#333",
              lineHeight: "1.8",
              fontSize: "16px",
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit.
          </p>
        </div>
      </div>

        {/* Footer Section */}
        <Footer />
    </div>
  );
};

export default Benifits;
