import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Connect = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="connect-page">
        {/* Hero Image Section */}
        <motion.div
          className="hero-image-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="./images/connect.jpg"
            alt="Hero"
            className="hero-image"
          />
        </motion.div>

        {/* Connect Form Section */}
        <section className="form-section">
          <Container>
            <motion.div
              className="form-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="text-center">
                <h2 className="the-artisan-font">Connect</h2>
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
                  <Button className="send-btn p-2" variant="outline-dark" type="submit">
                    SEND A REQUEST
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Container>
        </section>
      </div>
      

        {/* Footer Section */}
        <Footer />
    </div>
  );
};

export default Connect;
