import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShippingFast, FaCreditCard, FaMapMarkedAlt } from "react-icons/fa";
import "./refundpolicy.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const RefundPolicy = () => {
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
            <h1 className="fw-bold">Refund / Return Policy</h1>
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
                    <h4 className="fw-semibold">Payment Policy</h4>
                    <p>
                      We accept online orders through{" "}
                      <strong>Prepaid only</strong>. We accept Visa, Mastercard
                      & American Express Debit and Credit Cards, Netbanking, and
                      UPI as payment methods for prepaid orders.
                    </p>

                    <p>
                      All payment details are stored as per RBI guidelines and
                      are managed and provided by <strong>HDFC </strong> as a
                      payment gateway.
                    </p>

                    <p>
                      For Visa and Master Cards, you will be required to submit
                      your 16-digit card number, card expiry date, and 3-digit
                      CVV number. For American Express cards, you will be
                      required to submit your 15-digit card number and 4-digit
                      code.
                    </p>

                    <p>
                      If the amount has been deducted from your account but you
                      haven’t received a confirmation from us, please reach out
                      to our customer care team via the provided support link
                      with the required details.
                    </p>

                    <hr className="my-4" />

                    <h4 className="fw-semibold">Cancellation Policy</h4>
                    <p>
                      Orders once <strong>fulfilled or dispatched</strong> are
                      not eligible for cancellation.
                    </p>

                    <p>
                      If you wish to cancel your order before it is fulfilled,
                      please log in to your account and check the order status
                      or contact customer care for assistance.
                    </p>

                    <hr className="my-4" />

                    <h4 className="fw-semibold">Return & Exchange Policy</h4>
                    <p>
                      Our products are{" "}
                      <strong>non-returnable and non-exchangeable</strong>
                      due to hygiene reasons.
                    </p>

                    <p>
                      If you require a refund or replacement, please contact
                      customer care within <strong>24 hours</strong> of
                      receiving the order. Proof such as images and videos of
                      the product, packaging, and invoice may be required.
                    </p>

                    <p className="fw-semibold mt-3">
                      You will be eligible for a full refund or replacement
                      without incurring any charges if:
                    </p>

                    <ul>
                      <li>Products are missing from your order</li>
                      <li>Products are damaged or leaking</li>
                      <li>Wrong product received</li>
                      <li>Expired product received</li>
                    </ul>

                    <p className="fw-semibold mt-3">
                      Replacement will not be processed if:
                    </p>

                    <ul>
                      <li>
                        The product is tampered with or the seal is broken
                      </li>
                      <li>The invoice copy is missing</li>
                      <li>
                        Batch number, manufacturing date, or MRP are tampered
                        with
                      </li>
                      <li>The product is without original packaging</li>
                      <li>
                        The query is not raised within 24 hours of receiving the
                        product
                      </li>
                      <li>
                        Allergic reactions due to product usage – users are
                        advised to do a patch test and review ingredient details
                        before use
                      </li>
                    </ul>

                    <hr className="my-4" />

                    <h4 className="fw-semibold">Refund Policy</h4>
                    <p>
                      We may ask for proof such as images or videos before
                      initiating a refund.
                    </p>

                    <p>
                      Refunds will take <strong>5–7 business days</strong> to
                      reflect in your account. You will receive an SMS and Email
                      once the refund has been initiated.
                    </p>

                    <p className="fw-semibold mt-3">
                      Refund will not be processed if:
                    </p>
                    <ul>
                      <li>
                        Test for skin sensitivity by applying a small amount on
                        the wrist
                      </li>
                      <li>
                        Avoid contact with eyes; rinse thoroughly if contact
                        occurs
                      </li>
                      <li>
                        Discontinue use if irritation occurs and consult a
                        physician
                      </li>
                      <li>Keep out of reach of children</li>
                      <li>
                        Store in a cool, dry place away from direct sunlight
                      </li>
                      <li>For external use only</li>
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Trust Icons */}
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

      {/*Footer Section */}
      <Footer />
    </div>
  );
};

export default RefundPolicy;
