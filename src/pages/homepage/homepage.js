import React from "react";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Product from "../../components/product-images/product";
import Category from "../../components/category/category";

const Homepage = () => {
  const products = [
    {
      id: 1,
      name: "Aries Hydraglow Bath Gel",
      price: "₹ 750",
      image: "./images/bath-gel.jpg",
      ingredients: [
        "/images/fruit.jpg",
        "/images/flower.jpg",
        "/images/leaf.jpg",
        "/images/herb.jpg",
      ],
    },
    {
      id: 2,
      name: "Aries Luxe Essence",
      price: "₹ 1800",
      image: "./images/perfume.jpg",
      ingredients: [
        "/images/fruit.jpg",
        "/images/herb.jpg",
        "/images/flower.jpg",
        "/images/leaf.jpg",
      ],
    },
    {
      id: 3,
      name: "Aries SkinRevive Soap",
      price: "₹ 200",
      image: "./images/soap.jpg",
      ingredients: [
        "/images/fruit.jpg",
        "/images/flower.jpg",
        "/images/leaf.jpg",
        "/images/herb.jpg",
      ],
    },
    {
      id: 4,
      name: "Aries RefreshMint Oil",
      price: "₹ 750",
      image: "./images/oil.jpg",
      ingredients: [
        "/images/fruit.jpg",
        "/images/herb.jpg",
        "/images/flower.jpg",
        "/images/leaf.jpg",
      ],
    },
  ];
  const zodiacSigns = [
    { name: "Aries", color: "#7E0D0D", icon: "♈" },
    { name: "Taurus", color: "#7B8E2E", icon: "♉" },
    { name: "Gemini", color: "#C6932C", icon: "♊" },
    { name: "Cancer", color: "#B2B2B2", icon: "♋" },
    { name: "Leo", color: "#E0B900", icon: "♌" },
    { name: "Virgo", color: "#E66B3E", icon: "♍" },
    { name: "Libra", color: "#FF766B", icon: "♎" },
    { name: "Scorpio", color: "#111111", icon: "♏" },
    { name: "Sagittarius", color: "#6E4FA8", icon: "♐" },
    { name: "Capricorn", color: "#E7E1C5", icon: "♑" },
    { name: "Aquarius", color: "#6CC0C9", icon: "♒" },
    { name: "Pisces", color: "#003E5E", icon: "♓" },
  ];
  const productss = [
    { name: "BATH GEL" },
    { name: "BATH LOTION" },
    { name: "SOAP" },
    { name: "ESSENTIAL OIL" },
    { name: "EAU DE PERFUMES" },
    { name: "CANDLE" },
  ];
  const itemsData = [
    "BATH GEL",
    "BATH LOTION",
    "SOAP",
    "ESSENTIAL OIL",
    "EAU DE PERFUMES",
    "CANDLE",
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
          interval={3000} // Auto slide every 3 seconds
          pause={false} // Continue sliding even on hover
        >
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="./images/hero-section.png" // your first image
              alt="First slide"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="./images/hero-section1.png" // your second image
              alt="Second slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Products Section */}
      <section className="products-section py-5 text-center">
        <h2 className="products-title mb-5 tangerine-bold">Products</h2>
        <div className="container">
          <div className="row justify-content-center g-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
                <div className="product-card p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid product-image mb-3"
                  />
                  <h5 className="product-name">{product.name}</h5>
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-2 mb-3 flex-wrap">
                    {product.ingredients.map((icon, i) => (
                      <img
                        key={i}
                        src={icon}
                        alt="ingredient"
                        className="ingredient-icon"
                      />
                    ))}
                  </div>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <Category />

      {/* New Zodiac Section */}
      <div className="twelve-section">
        <div className=" d-flex flex-column flex-md-row align-items-center justify-content-center text-white p-4 container">
          {/* Left Section */}
          <div className="left-text text-center text-md-start mb-4 mb-md-0 pe-md-5">
            <h2 className="tangerine-bold">The Twelve</h2>
            <p className="subtitle">
              EXPLORE BY YOUR SUN,
              <br />
              MOON OR RISING SIGN
            </p>
          </div>

          {/* Zodiac Grid */}
          <div className="zodiac-grid container">
            <div className="row g-4 justify-content-center">
              {zodiacSigns.map((sign, index) => (
                <div
                  key={index}
                  className="col-6 col-sm-4 col-md-3 text-center"
                >
                  <div
                    className="zodiac-circle mx-auto"
                    style={{ backgroundColor: sign.color }}
                  >
                    <span className="zodiac-icon">{sign.icon}</span>
                  </div>
                  <p className="zodiac-name mt-2">{sign.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Text */}
          <div className="vertical-text d-none d-md-block">
            <span>NURTURE YOUR NATURE</span>
          </div>
        </div>
      </div>

      {/*Red Section can be added here*/}
      <section className="aries-section text-center">
        <div className="aries-content container">
          <h1 className="aries-title">Aries</h1>
          <div className="aries-icon-circle">
            <span className="aries-symbol">♈</span>
          </div>
          <p className="aries-date">Date : March 21 - April 19</p>

          <p className="aries-description">
            Aries, the natural ruler of healthy self-esteem, ego, fresh
            beginnings, spring, and physical presence, embodies the essence of
            selfhood. It is the sign of initiation—the spark that gives rise to
            identity and expression. At its core, Aries represents the formation
            of a strong, authentic sense of Self. Yet true evolution for Aries
            comes not only through bold individuality, but also through learning
            adaptability—acting with conviction while recognizing its role as a
            vital part of the greater whole.
          </p>

          <p className="aries-details">
            <span>Corresponding Letters : A, L, E, I, O</span> &nbsp;&nbsp; |
            &nbsp;&nbsp; <span>Astral Energy : Courage</span> &nbsp;&nbsp; |
            &nbsp;&nbsp; <span>Stamina</span>
            <br />
            <span>Colour : Red</span> &nbsp;&nbsp; | &nbsp;&nbsp;
            <span>Element : Fire</span> &nbsp;&nbsp; | &nbsp;&nbsp;
            <span>Ruling Planet : Mars</span>
          </p>
        </div>

        <div className="aries-images container d-flex justify-content-center align-items-end gap-5 flex-wrap">
          <img
            src="./images/ginger.png"
            alt="Ginger"
            className="half-out-image"
          />
          <img
            src="./images/Cinnamon.png"
            alt="Cinnamon"
            className="half-out-image"
          />
          <img
            src="./images/coconut.png"
            alt="Coconut"
            className="half-out-image"
          />
        </div>
      </section>

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

      <div
        className="container-fluid py-5 text-light"
        style={{ backgroundColor: "#52186b" }}
      >
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
          {/* Left Circle + Title */}
          <div className="text-center text-lg-start mb-4 mb-lg-0 animate__animated animate__fadeInLeft">
            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 30%, #2b013e, #3c005b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <h1
                style={{
                  fontSize: "70px",
                  fontWeight: "300",
                  color: "white",
                  letterSpacing: "5px",
                }}
              >
                MOON
              </h1>
            </div>
          </div>

          {/* Right Content */}
          <div
            className="text-center text-lg-end animate__animated animate__fadeInRight"
            style={{ maxWidth: "600px" }}
          >
            <p style={{ fontSize: "16px", lineHeight: "1.7" }}>
              The King and the Great Father embody the archetypes of the Sun—
              the source of all light and life, both earthly and spiritual. The
              Sun uplifts and energizes, offering inspiration, balance, and
              renewal. It rules over healthy self-esteem, life purpose,
              creativity, healing, and vitality, illuminating the path toward
              wholeness and strength.
            </p>

            <div className="d-flex flex-wrap justify-content-center justify-content-lg-end mt-4 gap-4">
              <span>Astral Energy : Vitality</span>
              <span>Colour : Gold</span>
              <span>Element : Fire</span>
              <span>Rules : Leo</span>
            </div>
          </div>
        </div>
      </div>
      {/* moon bottom */}

      <div className="container py-5">
        <div className="row g-4">
          {itemsData.map((item, index) => (
            <div
              className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
              key={index}
            >
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e0e0e0",
                  width: "100%",
                  height: "300px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  color: "#000",
                }}
              >
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* benifits */}

      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1
            className="fw-light mb-5"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "80px",
              color: "#000",
            }}
          >
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
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#e5e6e8" }}
      >
        <div className="container text-center">
          {/* Heading */}
          <h1
            className="fw-light mb-5"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "70px",
              color: "#000",
            }}
          >
            Know Us
          </h1>

          {/* Row */}
          <div className="row align-items-center justify-content-center">
            {/* Left Image */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4 mb-lg-0">
              <img
                src="./images/knowus-girl.jpg"
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
          <h1
            style={{
              fontFamily: "'Playfair Display', cursive",
              fontSize: "55px",
              fontWeight: "400",
              color: "#000",
              marginBottom: "10px",
            }}
          >
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
                <h2 className="connect-heading">Connect</h2>
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
                  <Button className="send-btn" type="submit">
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
