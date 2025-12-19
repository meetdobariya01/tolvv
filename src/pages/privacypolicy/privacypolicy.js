import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShippingFast, FaCreditCard, FaMapMarkedAlt } from "react-icons/fa";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import './privacypolicy.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Privacypolicy = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <Container fluid className="py-5 bg-light">
        <Container>
          {/* Page Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h1 className="fw-bold">Privacy Policy</h1>
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
                      The terms <strong>"We" / "Us" / "Our" / ”Company”</strong>{" "}
                      individually and collectively refer to{" "}
                      <strong>OM</strong> and the terms
                      <strong> "You" / "Your" / "Yourself"</strong> refer to the
                      users.
                    </p>

                    <p>
                      This Privacy Policy is an electronic record in the form of
                      an electronic contract formed under the Information
                      Technology Act, 2000 and the rules made thereunder and the
                      amended provisions pertaining to electronic documents /
                      records in various statutes as amended by the Information
                      Technology Act, 2000. This Privacy Policy does not require
                      any physical, electronic or digital signature.
                    </p>

                    <p>
                      This Privacy Policy is a legally binding document between
                      you and Tolvv The terms of this Privacy Policy will be
                      effective upon your acceptance and will govern the
                      relationship between you and Tolvv for your use of the
                      website.
                    </p>

                    <p>
                      This document is published and shall be construed in
                      accordance with the provisions of the Information
                      Technology (Reasonable Security Practices and Procedures
                      and Sensitive Personal Data or Information) Rules, 2011
                      under the Information Technology Act, 2000.
                    </p>

                    <p>
                      Please read this Privacy Policy carefully. By using the
                      Website, you indicate that you understand, agree and
                      consent to this Privacy Policy. If you do not agree,
                      please do not use this Website.
                    </p>

                    <p>
                      By providing us your information or by making use of the
                      facilities provided by the Website, you hereby consent to
                      the collection, storage, processing and transfer of your
                      personal and non-personal information as specified under
                      this Privacy Policy.
                    </p>

                    <hr className="my-4" />

                    <h4 className="fw-semibold">COOKIES</h4>
                    <p>
                      To improve the responsiveness of the site, we may use
                      "cookies" or similar electronic tools to collect
                      information to assign each visitor a unique user ID.
                      Unless you voluntarily identify yourself, we will have no
                      way of knowing who you are.
                    </p>

                    <p>
                      Our web servers automatically collect limited information
                      including your IP address. This information helps us
                      analyze traffic and deliver customized content.
                    </p>

                    <h4 className="fw-semibold mt-4">LINKS TO OTHER SITES</h4>
                    <p>
                      Our policy discloses the privacy practices for our website
                      only. Our site may provide links to other websites beyond
                      our control. We are not responsible for your use of such
                      sites.
                    </p>

                    <h4 className="fw-semibold mt-4">INFORMATION SHARING</h4>
                    <p>
                      We do not share sensitive personal information with third
                      parties except:
                    </p>
                    <ul>
                      <li>
                        When required by law, court order, or government
                        authority for investigation or legal compliance.
                      </li>
                      <li>
                        With our group companies, officers, or employees for
                        processing personal information under strict
                        confidentiality.
                      </li>
                    </ul>

                    <h4 className="fw-semibold mt-4">INFORMATION SECURITY</h4>
                    <p>
                      We implement appropriate security measures including
                      encryption, firewall protection, and restricted access.
                      However, no internet transmission is completely secure.
                    </p>

                    <p>
                      We may update this Privacy Policy from time to time. Our
                      use of information will always remain consistent with the
                      policy under which it was collected.
                    </p>

                    <h4 className="fw-semibold mt-4">GRIEVANCE REDRESSAL</h4>
                    <p>
                      Any complaints or concerns should be addressed to the
                      Grievance Officer:
                    </p>

                    {/* <p className="mb-1">
                      <strong>Mrs. Aditi Agrawal</strong>
                    </p>
                    <p className="mb-1">Grievance Officer</p>
                    <p className="mb-1">Tolvv</p>
                    <p className="mb-1">
                      A6 FF Safal Profitaire, Corporate Road, Prahladnagar,
                      <br />
                      Ahmedabad – 380015, Gujarat, India
                    </p> */}
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

          {/* Bottom Features */}
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

      {/* Footer Seciton */}
      <Footer />
    </div>
  );
};

export default Privacypolicy;
