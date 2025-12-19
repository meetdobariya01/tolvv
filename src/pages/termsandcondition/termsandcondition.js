import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShippingFast, FaCreditCard, FaMapMarkedAlt } from "react-icons/fa";
import "./termsandcondition.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Termsconditions = () => {
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
            <h1 className="fw-bold">Terms & Conditions</h1>
            <p className="text-muted">Tolvv-Nurture your Nature</p>
          </motion.div>

          {/* Content */}
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
                      <strong>OM</strong> and the terms{" "}
                      <strong>"Visitor" / "User"</strong> refer to the users.
                    </p>

                    <p>
                      This page states the Terms and Conditions under which you
                      (Visitor) may visit this website (“Website”). Please read
                      this page carefully. If you do not accept the Terms and
                      Conditions stated here, we request you to exit this site.
                    </p>

                    <p>
                      The business and its divisions, subsidiaries, associate
                      companies or investment companies reserve the right to
                      revise these Terms and Conditions at any time by updating
                      this page. These Terms and Conditions are binding on all
                      users.
                    </p>

                    <hr className="my-4" />

                    <h4 className="fw-semibold">USE OF CONTENT</h4>
                    <p>
                      All logos, brands, marks, headings, labels, names,
                      signatures, numerals, shapes or combinations appearing on
                      this site are properties owned or used under license by
                      the business or its associate entities.
                    </p>

                    <p>
                      You may not sell, modify, reproduce, display, distribute
                      or otherwise use the materials on this Website for any
                      public or commercial purpose without written permission.
                    </p>

                    <h4 className="fw-semibold mt-4">ACCEPTABLE WEBSITE USE</h4>

                    <h6 className="fw-semibold mt-3">Security Rules</h6>
                    <p>
                      Visitors are prohibited from violating or attempting to
                      violate website security, including:
                    </p>

                    <ul>
                      <li>
                        Accessing data not intended for the user or logging into
                        unauthorized servers or accounts.
                      </li>
                      <li>
                        Attempting to probe, scan or test system or network
                        vulnerabilities.
                      </li>
                      <li>
                        Attempting to interfere with service through viruses,
                        Trojan horses, overloading, flooding, mail bombing or
                        crashing.
                      </li>
                      <li>
                        Sending unsolicited electronic mail including promotions
                        or advertising.
                      </li>
                    </ul>

                    <p>
                      Violations may result in civil or criminal liability. The
                      Company may cooperate with law enforcement authorities in
                      prosecuting users involved in violations.
                    </p>

                    <h6 className="fw-semibold mt-4">General Rules</h6>
                    <p>
                      Visitors may not use the Website to transmit or store
                      material:
                    </p>

                    <ul>
                      <li>
                        That constitutes or encourages criminal conduct or
                        violates any law.
                      </li>
                      <li>
                        That infringes copyright, trademark, trade secret or
                        other intellectual property rights.
                      </li>
                      <li>
                        That is libellous, defamatory, pornographic, obscene,
                        threatening, abusive or hateful.
                      </li>
                    </ul>

                    <h4 className="fw-semibold mt-4">INDEMNITY</h4>
                    <p>
                      The User agrees to indemnify and hold harmless the
                      Company, its officers, directors, employees and agents
                      from any claims, losses, damages or liabilities arising
                      from use of www.tolvvsings.com or breach of these terms.
                    </p>

                    <h4 className="fw-semibold mt-4">LIABILITY</h4>
                    <p>
                      The Company shall not be liable for any direct, indirect,
                      incidental, special, consequential or exemplary damages
                      resulting from the use or inability to use the service,
                      including loss of profits, data or goodwill.
                    </p>

                    <p>
                      The Company shall not be liable for damages arising from
                      interruption, suspension or termination of service,
                      whether negligent or intentional.
                    </p>

                    <p>
                      In no event shall the Company’s total liability exceed the
                      amount paid by the user, if any, related to the cause of
                      action.
                    </p>

                    <h4 className="fw-semibold mt-4">
                      DISCLAIMER OF CONSEQUENTIAL DAMAGES
                    </h4>
                    <p>
                      In no event shall the Company or associated entities be
                      liable for any damages including incidental, consequential
                      damages, lost profits, loss of data or business
                      interruption resulting from use of this Website.
                    </p>
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

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Termsconditions;
