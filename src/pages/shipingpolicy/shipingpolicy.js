import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShippingFast, FaCreditCard, FaMapMarkedAlt } from "react-icons/fa";
import "./shipingpolicy.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ShippingPolicy = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <Container fluid className="py-5 bg-light">
        <Container>
          {/* Page Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h1 className="fw-bold">Shipping Policy</h1>
            <p className="text-muted">Tolvv-Nurture your Nature</p>
          </motion.div>

          {/* Policy Content */}
          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg rounded-4">
                  <Card.Body className="p-4 p-md-5">
                    <p>
                      Thank you for visiting and shopping at{" "}
                      <strong>www.tolvvsings.com</strong>
                    </p>

                    <h4 className="fw-semibold mt-4">
                      Domestic Shipping Policy
                    </h4>

                    <h6 className="fw-semibold mt-3">
                      Shipment Processing Time:
                    </h6>
                    <p>
                      All orders are processed within{" "}
                      <strong>2–5 business days</strong>.
                    </p>
                    <p>
                      Orders are not shipped or delivered on weekends or
                      holidays.
                    </p>

                    <p>
                      If we are experiencing a high volume of orders, shipments
                      may be delayed by a few days. Please allow additional days
                      in transit for delivery. If there will be a significant
                      delay in shipment of your order, we will contact you via
                      email or telephone.
                    </p>

                    <h4 className="fw-semibold mt-4">Delivery and Tracking</h4>
                    <p>
                      You will be provided with a tracking number to track your
                      orders. All our orders are processed through{" "}
                      <strong>www.delhivery.com</strong>.
                    </p>

                    <h4 className="fw-semibold mt-4">Contact Details</h4>
                    <p className="mb-1">
                      <strong>Mrs. Aditi Agarwal</strong>
                    </p>
                    <p className="mb-1">Phone: +91 9824257356</p>
                    <p>
                      Email:{" "}
                      <a href="mailto:care@tolvvsigns.com">
                        care@tolvvsigns.com
                      </a>
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Trust Badges */}
          <Row className="text-center mt-5 g-4">
            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <FaShippingFast size={80} className="mb-2 text-dark" />
                <h6 className="fw-semibold">Free Shipping</h6>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <FaCreditCard size={80} className="mb-2 text-dark" />
                <h6 className="fw-semibold">All Cards Accepted</h6>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <FaMapMarkedAlt size={80} className="mb-2 text-dark" />
                <h6 className="fw-semibold">Ships All Over India</h6>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
