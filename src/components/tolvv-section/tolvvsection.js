import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AOS from "aos";
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
      <section className="tolvv-section">
        <Container> 
          <Row className="align-items-center">
            {/* Left Content */}
            <Col lg={6} md={12} data-aos="fade-right">
              <div className="tolvv-content text-center sora">
                <h2>WHAT IS TOLVV?</h2>

                <p>
                  Tolvv is inspired by the twelve sun signs — the cosmic forces
                  that shape our emotions, energy, and essence. Since ancient
                  times, the alignment of the sun, moon, and planets has guided
                  us, revealing how the universe influences our lives and
                  well-being.
                </p>

                <p>
                  At Tolvv, we've reimagined this ancient wisdom into a modern
                  skincare experience, where the mind, body, and soul come into
                  alignment. Each product is thoughtfully crafted to reflect the
                  unique energy of the zodiac, helping you nurture your
                  emotional, physical, and spiritual balance through everyday
                  rituals.
                </p>

                <p>
                  These are more than skincare essentials — they are reflections
                  of you, designed to help you glow from within, in harmony with
                  the cosmos.
                </p>
              </div>
            </Col>

            {/* Right Image */}
            <Col lg={6} md={12} data-aos="fade-left">
              <div className="tolvv-image">
                <img
                  src="/images/tolvv-section.png"
                  alt="Tolvv Product"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Tolvvsection;
