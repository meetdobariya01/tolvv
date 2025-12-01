import React from "react";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Product from "../../components/product-images/product";
import Category from "../../components/category/category";
import "./homepage.css";
import Homeproduct from "../../components/category/home-product/homeproduct";
import Leoproduct from "../leo-product/leoproduct";
import Allfaqs from "../../components/faqs-Q&A/allfaqs";
import Zodic from "../Zodiacs/zodics";

const Homepage = () => {
  const productss = [
    { name: "BATH GEL" },
    { name: "BATH LOTION" },
    { name: "SOAP" },
    { name: "ESSENTIAL OIL" },
    { name: "EAU DE PERFUMES" },
    { name: "CANDLE" },
  ];

  const planets = [
    {
      name: "Moon",
      color: "linear-gradient(135deg, #3b0069, #5a267d)",
      meaning: "Calm",
    },
    {
      name: "Sun",
      color: "linear-gradient(135deg, #ffcf00, #d4a017)",
      meaning: "Energy",
    },
    {
      name: "Mercury",
      color: "linear-gradient(135deg, #f3b500, #c79300)",
      meaning: "Clarity",
    },
    {
      name: "Venus",
      color: "linear-gradient(135deg, #006b3c, #004d2a)",
      meaning: "Radiance",
    },
    {
      name: "Mars",
      color: "linear-gradient(135deg, #b11313, #780000)",
      meaning: "Passion",
    },
    {
      name: "Jupiter",
      color: "linear-gradient(135deg, #3b2ca5, #221c75)",
      meaning: "Optimism",
    },
    {
      name: "Saturn",
      color: "linear-gradient(135deg, #1a1a1a, #000)",
      meaning: "Wisdom",
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: { scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" },
  };

  return (
    <div>
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="carousel-container">
        <Carousel
          fade
          controls={false}
          indicators={true}
          interval={3000}
          pause={false}
        >
          {/* REMOVE THIS FIRST IMAGE — replaced with VIDEO */}
          {/* <Carousel.Item>
            <video
              className="d-block w-100 h-auto carousel-img"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="./images/video.mp4" type="video/mp4" />
            </video>
          </Carousel.Item> */}

          {/* KEEP SECOND IMAGE */}
          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/hero-section1.png"
              alt="Second slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Products Section */}
      <Homeproduct />

      {/* Zodics section */}
      <Zodic />

      {/* products grid */}
      <Product />

      {/* ruling planet */}

      <div
        className="container-fluid py-5 text-center"
        style={{ backgroundColor: "#d6d8da" }}
      >
        <h3
          className="fw-bold mb-5 animate__animated animate__fadeInDown"
          style={{ letterSpacing: "2px" }}
        >
          EXPLORE BY YOUR RULING PLANET
        </h3>

        <div className="row justify-content-center g-4">
          {planets.map((planet, index) => (
            <div
              className="col-6 col-sm-4 col-md-3 col-lg-1 d-flex flex-column align-items-center animate__animated animate__zoomIn"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1s",
              }}
              key={index}
            >
              <div
                style={{
                  background: planet.color,
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                }}
              ></div>

              <p className="mt-3 fw-semibold">{planet.name}</p>

              <div
                style={{
                  width: "2px",
                  height: "40px",
                  backgroundColor: "black",
                  marginTop: "5px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "8px solid black",
                    position: "absolute",
                    bottom: "-8px",
                    left: "-4px",
                  }}
                ></div>
              </div>

              <p className="mt-2 fw-medium">{planet.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* moon section */}
      <div className="moon-wrapper d-flex justify-content-center align-items-center">
        <div className="container text-white py-5">
          <div className="row align-items-center">
            {/* LEFT SIDE */}
            <div className="col-12 col-md-6 position-relative text-center mb-5 mb-md-0">
              {/* Moon */}
              <img
                src="./images/moon.png"
                alt="Moon"
                className="moon-img fade-in-scale"
              />

              {/* Text on Moon */}
              <h1 className="moon-title fade-in-up">MOON</h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-12 col-md-6 fade-in-right text-center text-md-start">
              <p>
                The King and the Great Father embody the archetypes of the
                Sun—the source of all light and life, both earthly and
                spiritual. The Sun uplifts and energizes, offering inspiration,
                balance, and renewal. It rules over healthy self-esteem, life
                purpose, creativity, healing, and vitality, illuminating the
                path toward wholeness and strength.
              </p>

              <div className="details mt-4 d-flex flex-wrap gap-4 justify-content-center justify-content-md-start">
                <span>Astral Energy : Vitality</span>
                <span>Colour : Gold</span>
                <span>Element : Fire</span>
                <span>Rules : Leo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* moon bottom */}

      {/* Leo products */}
      <Leoproduct />

      {/* benifits */}

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1 className="fw-light mb-5 the-artisan-font">Benefits</h1>

          {/* Paragraph 1 */}
          <p
            className="mx-auto"
            style={{
              // maxWidth: "900px",
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
              // maxWidth: "900px",
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
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1 className="fw-light mb-5 the-artisan-font">Know Us</h1>

          {/* Row */}
          <div className="row align-items-center justify-content-center">
            {/* Left Image */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4 mb-lg-0">
              <img
                src="./images/know-us.jpeg"
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
      <div className="" style={{ backgroundColor: "" }}>
        {/* Contact Form Section */}
        <section className="form-section">
          <Container>
            <motion.div
              className="form-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="text-center">
                <h2 className=" the-artisan-font">Connect</h2>
                <p className="connect-subtext">DON’T PUT YOUR DOUBTS ON HOLD</p>
              </div>

              <p className="text-center mt-4 text-uppercase connect-desc">
                CONTACT US TO DISCUSS YOUR QUESTIONS OR CONNECT FOR
                COLLABORATION
              </p>

              <Form className="connect-form mt-4">
                <Form.Group className="mb-4">
                  <Form.Control type="text" placeholder="YOUR NAME" />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control type="email" placeholder="YOUR EMAIL" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="text"
                        placeholder="YOUR PHONE NUMBER"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="SUBJECT OF YOUR CONCERNS"
                  />
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="YOUR MESSAGE"
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    className="send-btn p-2"
                    variant="outline-dark"
                    type="submit"
                  >
                    SEND A REQUEST
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Container>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
