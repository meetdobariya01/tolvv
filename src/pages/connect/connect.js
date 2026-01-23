import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_URL = process.env.REACT_APP_API_URL;

const Connect = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.subject || !form.message) {
      setAlert({ type: "danger", message: "All fields are required." });
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setAlert({ type: "danger", message: "Please enter a valid email address." });
      return false;
    }

    if (form.phone.length < 8) {
      setAlert({ type: "danger", message: "Please enter a valid phone number." });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!validateForm()) return;

    setSending(true);

    try {
      const res = await fetch(`${API_URL}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setAlert({
        type: "success",
        message: "Message sent successfully! We’ll get back to you shortly.",
      });

      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setAlert({ type: "danger", message: err.message || "Server error" });
    } finally {
      setSending(false);
    }
  };

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
          <img src="./images/connect.jpg" alt="Hero" className="hero-image" />
        </motion.div>

        {/* Connect Form Section */}
        <section className="form-section sora">
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
                CONTACT US TO DISCUSS YOUR QUESTIONS OR CONNECT FOR COLLABORATION
              </p>

              {alert.message && (
                <Alert variant={alert.type} className="text-center mt-3">
                  {alert.message}
                </Alert>
              )}

              <Form className="connect-form mt-4" onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="YOUR NAME"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="YOUR EMAIL"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="YOUR PHONE NUMBER"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="SUBJECT OF YOUR CONCERNS"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="YOUR MESSAGE"
                    required
                  />
                </Form.Group>

                <div>
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