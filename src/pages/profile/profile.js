import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./profile.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const AccountPage = () => {
  const [active, setActive] = useState("profile");
  const [orderTab, setOrderTab] = useState("current");

  const fade = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div>
      {/* Header Section */}
      <Header />

      <Container fluid className="py-5 account-page container sora">
        <Row>
          {/* SIDEBAR */}
          <Col lg={3} md={4} className="border-end sidebar">
            <h6 className="fw-bold">YOUR ACCOUNT</h6>
            <small>xyz@gmail.com</small>

            <ul className="list-unstyled mt-4 sidebar-menu">
              <ul className="list-unstyled mt-4 sidebar-menu">
                <li
                  className={active === "profile" ? "active-menu" : ""}
                  onClick={() => setActive("profile")}
                >
                  Profile
                </li>

                <li
                  className={active === "orders" ? "active-menu" : ""}
                  onClick={() => setActive("orders")}
                >
                  My Orders
                </li>

                <li
                  className={active === "support" ? "active-menu" : ""}
                  onClick={() => setActive("support")}
                >
                  Customer Support
                </li>

                <li>Log Out</li>
              </ul>
            </ul>
          </Col>

          {/* CONTENT */}
          <Col lg={9} md={8} className="ps-lg-5 mt-4 mt-md-0">
            {/* PROFILE */}
            {active === "profile" && (
              <motion.div initial="hidden" animate="visible" variants={fade}>
                <Form className="profile-form">
                  <Form.Group className="mb-3">
                    <Form.Control placeholder="NAME" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Phone No." />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="XYZ@gmail.com" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="DD/MM/YYYY" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Gender" />
                  </Form.Group>

                  <button className="btn btn-outline-dark" size="sm">
                    SAVE
                  </button>

                  <h5 className="mt-5">Address</h5>

                  <div className="mb-3">
                    <Button size="sm" variant="outline-dark" className="me-2">
                      Use Default Address
                    </Button>
                    <Button size="sm" variant="outline-dark">
                      Add New
                    </Button>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Flat/Apartment No." />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Apartment Name" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control placeholder="Street Name/Landmark" />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Control placeholder="Pin Code" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="City" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="State" />
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-3"
                    label="Keep it as a default Address"
                  />

                  <Button className="mt-3" variant="outline-dark" size="sm">
                    SAVE
                  </Button>
                </Form>
              </motion.div>
            )}

            {/* ORDERS */}
            {active === "orders" && (
              <motion.div initial="hidden" animate="visible" variants={fade}>
                <div className="mb-4">
                  <Button
                    size="sm"
                    variant={orderTab === "current" ? "dark" : "light"}
                    className={
                      orderTab === "current" ? "me-2" : "me-2 btn-light"
                    }
                    onClick={() => setOrderTab("current")}
                  >
                    Current Orders
                  </Button>

                  <Button
                    size="sm"
                    variant={orderTab === "previous" ? "dark" : "light"}
                    onClick={() => setOrderTab("previous")}
                  >
                    Previous Orders
                  </Button>
                </div>

                <Row>
                  {[1, 2, 3].map((item) => (
                    <Col lg={4} key={item}>
                      <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                          <small>ORDER PLACED ON</small>
                          <p>17 January, 2026</p>

                          <div className="d-flex align-items-center gap-3">
                            <img src="https://via.placeholder.com/50" alt="" />
                            <div>
                              <h6>Aries Bath Gel</h6>
                              <small>Quantity: 1</small>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="mt-3"
                            variant="outline-dark"
                          >
                            Download Invoice
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}

            {/* SUPPORT */}
            {active === "support" && (
              <motion.div initial="hidden" animate="visible" variants={fade}>
                <p>You can reach out to us for any complaints or concerns</p>

                <h6 className="fw-bold">care@tolvvsigns.com</h6>

                <div className="mt-4 support-links">
                  <div className="support-links">
                    <p>
                      <NavLink to="/privacy-policy" className="support-link">
                        Privacy Policy ›
                      </NavLink>
                    </p>

                    <p>
                      <NavLink
                        to="/terms-and-condition"
                        className="support-link"
                      >
                        Terms & Conditions ›
                      </NavLink>
                    </p>

                    <p>
                      <NavLink to="/shipping-policy" className="support-link">
                        Shipping Policy ›
                      </NavLink>
                    </p>

                    <p>
                      <NavLink to="/refund-policy" className="support-link">
                        Refund Policy ›
                      </NavLink>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AccountPage;
