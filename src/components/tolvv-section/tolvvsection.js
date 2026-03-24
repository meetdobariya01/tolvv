import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./tolvvsection.css";

const Tolvvsection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <div>
      <section className="about-section sora">
        {/* <Container> */}
          <Row className="align-items-center justify-content-center g-5 ">
            {/* 1️⃣ LEFT SMALL TITLE */}
            <Col lg={3} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="about-left text-center "
              >
                <h2>
                  What <br /> is <br /> TOLVV?
                </h2>
              </motion.div>
            </Col>

            {/* 2️⃣ CENTER TEXT */}
            <Col lg={5} md={12}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="about-center p-3"
              >
                <p>
                  TOLVV, derived from the Scandinavian word for 12, is a Zodiac
                  inspired Sun-Sign based Bath & Body range of products.
                </p>

                <p>
                  TOLVV is designed around the twelve sun signs — the cosmic
                  forces that shape our emotions, energy, and essence. Since
                  ancient times, the alignment of the sun, moon, and planets has
                  guided us, revealing how the universe influences our lives and
                  well-being.
                </p>

                <p>
                  At TOLVV, we re-imagined this ancient wisdom into a modern
                  bath and body experience, where the mind, body, and soul come
                  into alignment. Each product is thoughtfully crafted to
                  reflect the unique energy of the zodiac, helping you nurture
                  your emotional, physical, and spiritual balance through
                  everyday rituals.
                </p>

                <h5 className="about-tagline">
                  Celestial. Ritualistic. Personalized
                </h5>
              </motion.div>
            </Col>

            {/* 3️⃣ RIGHT IMAGE */}
            <Col lg={4} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="about-right"
              >
                <img
                  src="/images/hamper-tolvv.png"
                  alt="product"
                  className="about-image"
                />
              </motion.div>
            </Col>
          </Row>
        {/* </Container> */}
      </section>
    </div>
  );
};

export default Tolvvsection;
