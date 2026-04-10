import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Category from "../../components/category/category";
import "./homepage.css";
import Homeproduct from "../../components/category/home-product/homeproduct";
// import Leoproduct from "../leo-product/leoproduct";
import Allfaqs from "../../components/faqs-Q&A/allfaqs";
import Zodic from "../Zodiacs/zodics";
import Moonsection from "../../components/moonsection/moonsection";
import { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import Tolvvsection from "../../components/tolvv-section/tolvvsection";
import Reviews from "../../components/reviews/reviews";
import HomeModal from "../../components/modal/modal";
import TopBanner from "../../components/discount-code/discount";

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
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = form;

    if (!name || !email || !phone || !subject || !message) {
      alert("All fields are required");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`${API_URL}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      alert("Message sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Connect error:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);
  return (
    <div>
      {/* Header Component */}
      <Header />

      {/* Modal Component */}
      <HomeModal />

      {/* Discount Code */}
      <TopBanner />

      {/* Main Content */}
      <div className="carousel-container d-none d-md-block d-lg-block">
        <Carousel
          fade
          controls={false}
          indicators={true}
          interval={2000}
          pause={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/banner-1.webp"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/banner-2.jpeg"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/banner-3.jpeg"
              alt="third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Mobile */}
      <div className="carousel-container d-block d-md-none d-lg-none">
        <Carousel
          fade
          controls={false}
          indicators={true}
          interval={2000}
          pause={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/mobile-1.jpg"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/mobile-2.jpg"
              alt="Second slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 h-auto carousel-img"
              src="./images/mobile-3.jpg"
              alt="third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* what is tolvv Section */}
      <Tolvvsection />

      <section id="zodiac">
        {/* Zodics section */}
        <Zodic />
      </section>

      {/* moon section */}
      <Moonsection />

      {/* Banner Section */}
      <div className="hero-banner">
        <Container className="hero-content-1 text-dark text-start sora py-5">
          <h2>Crafted for your skin's glow.</h2>
          <p>EXPLORE PRODUCTS FROM BATH GELS TO ESSENTIAL OILS & PERFUMES.</p>
        </Container>
      </div>

      {/* Products Section */}
      <Homeproduct />

      {/* benifits */}

      <section className="benefits-wrapper" id="benefits">
        {/* <Container flui> */}
        <Row className="g-0 align-items-center">
          {/* Left Image */}
          <Col lg={3} md={12}>
            <div className="benefits-image">
              <img
                src="./images/benifits.png"
                alt="benefits"
                className="img-fluid"
              />
            </div>
          </Col>

          {/* Right Content */}
          <Col lg={9} md={12}>
            <div className="benefits-content sora text-center">
              <h2 className="benefits-title artisan-font text-center">
                The Benefits
              </h2>

              <p>
                Our Zodiac Collection blends luxurious skincare with the energy
                of your sign, creating a ritual that feels personally designed
                for you. Each soap, body lotion, bath gel, and perfume is
                infused with mood-enhancing aromas, skin-loving botanicals, and
                intention-driven formulations that resonate with your zodiac’s
                natural traits. Whether you’re a fiery Aries seeking
                invigorating freshness or a calm Pisces craving soothing
                hydration, every product aligns with the essence of your cosmic
                personality.{" "}
              </p>

              <p>
                These products don’t just nourish your skin; they elevate your
                spirit. Feel the difference as signature fragrances boost your
                mood, celestial ingredients restore balance, and your daily
                routine transforms into a grounding, empowering ritual. With
                every use, you’re not just caring for your body—you’re
                connecting with your inner energy, enhancing your aura, and
                celebrating the unique magic of your zodiac sign.
              </p>
            </div>
          </Col>
        </Row>
        {/* </Container> */}
      </section>

      {/* Know us Section */}
      <section className="know-wrapper" id="knowus">
        <Container>
          <Row className="align-items-center">
            {/* LEFT CONTENT */}
            <Col
              lg={6}
              md={12}
              className="d-flex justify-content-center px-2 px-md-5"
            >
              <div className="know-content sora ">
                <h2 className="know-title artisan-font">Know Us Better</h2>
                <h6 className="know-subtitle text-end">
                  Neha, Shreeya & Aditi
                </h6>

                <p className="bold">
                  We’re Neha and Aditi, kindred souls on a shared path.
                </p>

                <p>
                  United by more than friendship, a spiritual journey that has
                  guided every step of our lives. A bond beyond emotions,
                  founded on connection, spirituality, and the subtle guidance
                  of the universe.
                </p>

                <p>
                  Together, we discovered a shared passion for zodiac, the
                  energy of the signs, and he spiritual rhythm that flows
                  through everything around us. This passion inspired us to
                  start our personalised bath and body brand, a space where
                  signs meets science, where every product resonates with the
                  unique energy of the 12 sun signs. Each product is crafted
                  with intention, care, and love, so you can experience
                  self-care that’s deeply personal, and aligned with your cosmic
                  energy.
                </p>

                <p className="bold">Hi, I am Shreeya,</p>

                <p>
                  As the next generation in this journey, I grew up immersed in
                  spirituality, zodiac wisdom, and the belief that energy shapes
                  everything. As a Capricorn, I am grounded yet deeply intuitive
                  - drawn to the structure of science as much as the mystery of
                  the cosmos. I help bridge tradition with a modern lens,
                  blending branding, creativity, and intention into every detail
                  of our products. For me, this brand is about creating rituals
                  that feel intimate, empowering & aligned — where self-care
                  becomes a reflection of who you truly are.
                </p>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={6} md={12} className="d-flex justify-content-end">
              <div className="know-image">
                <img src="./images/knowus.png" alt="team" className="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <div
        className="container-fluid py-2 py-lg-5"
        style={{ backgroundColor: "#D1D3D4" }}
      >
        <section className="faq-header sora pt-5" id="faqs">
          <Container>
            <Row className="align-items-center">
              {/* Left Side */}
              <Col lg={6} md={12}>
                <div className="faq-left">
                  <h1 className="faq-title artisan-font">Faqs</h1>
                  <p className="faq-subtitle">Questions you may have</p>
                </div>
              </Col>

              {/* Right Side */}
              <Col lg={6} md={12}>
                <div className="faq-right">
                  <p>
                    We have picked our most frequently asked questions to help
                    with your queries. Explore them here
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <div className="container text-center">
          {/* Header */}

          {/* FAQ List */}
          <div
            className="text-start mt-5 mx-auto"
            style={{ fontSize: "15px", color: "#000" }}
          >
            {/* <hr /> */}
            <Allfaqs />
          </div>
        </div>
      </div>

      <div className="pt-5 p-lg-5 " style={{ backgroundColor: "#f2f3f3" }}>
        {/* Contact Form Section */}
        <section className="form-section sora" id="contact">
          <Container>
            <motion.div
              className="form-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="text-center">
                <h2 className="artisan-font">Connect</h2>
                <p className="connect-subtext">DON’T PUT YOUR DOUBTS ON HOLD</p>
              </div>

              <p className="text-center mt-4 text-uppercase connect-desc">
                CONTACT US TO DISCUSS YOUR QUESTIONS OR CONNECT FOR
                COLLABORATION
              </p>

              <Form className="connect-form mt-4 p-2 p-md-3 p-lg-0" onSubmit={handleSubmit}>
                <Form.Group className="mb-4 ">
                  <Form.Control
                    className="underline-input"
                    type="text"
                    placeholder="YOUR NAME"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        className="underline-input"
                        type="email"
                        placeholder="YOUR EMAIL"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        className="underline-input"
                        type="text"
                        placeholder="YOUR PHONE NUMBER"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Control
                    className="underline-input"
                    type="text"
                    placeholder="SUBJECT OF YOUR CONCERNS"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Control
                    className="underline-input"
                    as="textarea"
                    rows={2}
                    placeholder="YOUR MESSAGE"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  className="send-btn p-2"
                  variant="outline-dark"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Spinner animation="border" size="sm" /> Sending...
                    </>
                  ) : (
                    "SEND A REQUEST"
                  )}
                </Button>
              </Form>
            </motion.div>
          </Container>
        </section>
      </div>

      {/* Reviews Section */}
      <Reviews />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Homepage;
