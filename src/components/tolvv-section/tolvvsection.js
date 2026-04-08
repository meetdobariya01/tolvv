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
    <div className="tolvv-section-wrapper">
      <section className="about-section sora container ">
        {/* <Container> */}
        <Row className="align-items- justify-content-center g-0 g-md-5">
          {/* 1️⃣ LEFT SMALL TITLE */}
          <Col
            lg={2}
            md={12}
            className="d-flex justify-content-center align-items-start  text-start"
          >
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="about-left tolvv-section"
            >
              <h2>
                What is{" "}
                <span className="d-none d-lg-inline">
                  <br />
                </span>
                TOLVV?
              </h2>
            </motion.div>
          </Col>
          {/* 2️⃣ CENTER TEXT */}
          <Col lg={6} md={12}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="about-center p-3"
            >
              <h5 className="about-tagline">
                Celestial. Ritualistic. Personalized
              </h5>
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
                At TOLVV, we’ve re-imagined this ancient wisdom into a modern
                bath and body experience, where the mind, body, and soul come
                into alignment. Each product is thoughtfully crafted to reflect
                the unique energy of the zodiac, helping you nurture your
                emotional, physical, and spiritual balance through everyday
                rituals.
              </p>
              <p>
                These are more than bath and body essentials - they are
                reflections of you, designed to help you low from within, in
                harmony with the cosmos.
              </p>
            </motion.div>
          </Col>

          {/* 3️⃣ RIGHT IMAGE */}
          <Col lg={4} md={12}>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="about-right d-flex justify-content-center align-items-center"
            >
              <img
                src="/images/hamper-tolvv.jpg"
                alt="product"
                className="about-image"
              />
            </motion.div>
          </Col>
        </Row>
        {/* </Container> */}
        <div className="zodiac-row-tolvv sora d-none d-lg-flex">
          {[
            { name: "Aries", img: "./images/zodiac/1-2.png" },
            { name: "Taurus", img: "./images/zodiac/2-2.png" },
            { name: "Gemini", img: "./images/zodiac/3-2.png" },
            { name: "Cancer", img: "./images/zodiac/4-2.png" },
            { name: "Leo", img: "./images/zodiac/5-2.png" },
            { name: "Virgo", img: "./images/zodiac/6-2.png" },
            { name: "Libra", img: "./images/zodiac/7-2.png" },
            { name: "Scorpio", img: "./images/zodiac/8-2.png" },
            { name: "Sagittarius", img: "./images/zodiac/9-2.png" },
            { name: "Capricorn", img: "./images/zodiac/10-2.png" },
            { name: "Aquarius", img: "./images/zodiac/11-2.png" },
            { name: "Pisces", img: "./images/zodiac/12-2.png" },
          ].map((zodiac, index) => (
            <div key={index} className="zodiac-item">
              <div className="zodiac-circle-tolvv">
                <img src={zodiac.img} alt={zodiac.name} />
              </div>
              <p>{zodiac.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tolvvsection;
