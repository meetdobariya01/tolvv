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
import Moonsection from "../../components/moonsection/moonsection";

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
          interval={2000}
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
              src="./images/carousel-1.jpg"
              alt="Second slide"
            />
          </Carousel.Item>

          {/* <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/carousel-2.jpg"
              alt="Second slide"
            />
          </Carousel.Item> */}

          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/carousel-3.jpg"
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
      {/* <Product /> */}

      
     

      {/* moon section */}
      <Moonsection/>

     

      {/* benifits */}

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#D1D3D4" }}
      >
        <div className="container text-center benifits-section">
          {/* Heading */}
          <h1 className="fw-light mb-5 the-artisan-font">Benefits</h1>

          {/* Paragraph 1 */}
          <p
            className="mx-auto"
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
        style={{ backgroundColor: "#D1D3D4" }}
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
            <div className="col-lg-6 col-md-10 col-sm-12 text-center">
              <h2
                className="fw-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                }}
              >
                NEHA & ADITI
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
        style={{ backgroundColor: "#D1D3D4" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center text-center">
            {/* Left Text Section */}
            <div className="col-lg-6 col-md-10 col-sm-12 mb-4 mb-lg-0">
              <h2
                className="fw-bold mb-4 text-center "
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
                src="./images/tolvv.jpg"
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
        style={{ backgroundColor: "#D1D3D4" }}
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
            style={{ fontSize: "15px", color: "#000" }}
          >
            <hr />
            <Allfaqs />
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

                <div className="">
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

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Homepage;
