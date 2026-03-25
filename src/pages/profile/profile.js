import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const AccountPage = () => {
  const [active, setActive] = useState("profile");
  const [orderTab, setOrderTab] = useState("current");

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    mobile: "",
    dob: "",
    gender: "",
    email: ""
  });

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    buildingName: "",
    societyName: "",
    road: "",
    landmark: "",
    city: "",
    pincode: "",
    mobile: "",
    isDefault: false
  });

  const fade = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const API = process.env.REACT_APP_API_URL;

  // Fetch Profile
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(res.data);

    } catch (err) {
      console.error("Profile Fetch Error:", err);
    }
  };

  // Update Profile
  const updateProfile = async () => {
    if (!token) return;

    try {
      await axios.put(`${API}/user/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile Updated");
      fetchProfile();

    } catch (err) {
      console.error("Profile Update Error:", err);
    }
  };
  const downloadInvoice = async (orderId) => {
    try {

      const response = await axios.get(
        `${API}/invoice/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);

      link.click();

    } catch (error) {
      console.error("Invoice Download Error:", error);
    }
  };
const fetchOrders = async (type) => {
  if (!token) return;

  try {
    const res = await axios.get(`${API}/orders/${type}-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("ORDERS RESPONSE", res.data);
    setOrders(Array.isArray(res.data) ? res.data : []); // ✅ ensures .map() doesn't crash
  } catch (err) {
    console.error("Orders Fetch Error:", err);
  }
};

  // Fetch Addresses
  const fetchAddresses = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API}/user/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAddresses(res.data);

    } catch (err) {
      console.error("Address Fetch Error:", err);
    }
  };

  // Add Address
  const addAddress = async () => {
    if (!token) return;

    try {
      await axios.post(`${API}/user/address`, newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchAddresses();

      setNewAddress({
        flatNumber: "",
        apartmentName: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false
      });

      alert("Address Added");

    } catch (err) {
      console.error("Add Address Error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
    fetchOrders("current");
  }, []);

  useEffect(() => {
    if (orderTab === "current") fetchOrders("current");
    else fetchOrders("previous");
  }, [orderTab]);

  return (
    <div>
      <Header />

      <Container fluid className="py-5 account-page container sora">
        <Row>

          {/* SIDEBAR */}
          <Col lg={3} md={4} className="border-end sidebar">
            <h6 className="fw-bold">YOUR ACCOUNT</h6>
            <small>{profile.email}</small>

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

                <li
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  Log Out
                </li>
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
                    <Form.Control
                      placeholder="NAME"
                      value={profile.fname}
                      onChange={(e) =>
                        setProfile({ ...profile, fname: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Phone No."
                      value={profile.mobile}
                      onChange={(e) =>
                        setProfile({ ...profile, mobile: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="XYZ@gmail.com"
                      value={profile.email}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="DD/MM/YYYY"
                      value={profile.dob || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, dob: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Gender"
                      value={profile.gender || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                    />
                  </Form.Group>

                  <button
                    className="btn btn-outline-dark"
                    size="sm"
                    onClick={updateProfile}
                    type="button"
                  >
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

                  {/* Flat / Apartment */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Flat/Apartment No."
                      value={newAddress.houseNumber}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, houseNumber: e.target.value })
                      }
                    />
                  </Form.Group>

                  {/* Building */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Apartment Name"
                      value={newAddress.buildingName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, buildingName: e.target.value })
                      }
                    />
                  </Form.Group>

                  {/* Road / Landmark */}
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Street Name / Landmark"
                      value={newAddress.road}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, road: e.target.value })
                      }
                    />
                  </Form.Group>

                  {/* Pin / City / State */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Control
                        placeholder="Pin Code"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                      />
                    </Col>

                    <Col>
                      <Form.Control
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                      />
                    </Col>

                    <Col>
                      <Form.Control
                        placeholder="State"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, landmark: e.target.value })
                        }
                      />
                    </Col>
                  </Row>

                  {/* Default Address */}
                  <Form.Check
                    className="mb-3"
                    label="Keep it as a default Address"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        isDefault: e.target.checked
                      })
                    }
                  />

                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={addAddress}
                  >
                    SAVE
                  </Button>


                </Form>
              </motion.div>
            )}

            {/* ORDERS */}
            {active === "orders" && (
              <motion.div initial="hidden" animate="visible" variants={fade}>

                {/* Tabs */}
                <div className="order-tabs mb-4">
                  <button
                    className={orderTab === "current" ? "active-tab" : ""}
                    onClick={() => setOrderTab("current")}
                  >
                    Current Orders
                  </button>

                  <button
                    className={orderTab === "previous" ? "active-tab" : ""}
                    onClick={() => setOrderTab("previous")}
                  >
                    Previous Orders
                  </button>
                </div>

                {/* GRID */}
                <div className="orders-grid">
                  {(Array.isArray(orders) ? orders : []).map((order) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const item = items[0];// use safe array

                    return (
                      <div key={order._id} className="order-card">
                        {/* Date */}
                        <p className="order-date-title">
                          {order.type === "exchange" ? "EXCHANGE PLACED ON" : "ORDER PLACED ON"}
                          <br />
                          <span>{new Date(order.createdAt).toDateString()}</span>
                        </p>

                        {/* Product Row */}
                        <div className="order-row">
                          <img
                            src={
                              Array.isArray(item?.productId?.Photos) && item.productId.Photos[0]
                                ? `/images/${item.productId.Photos[0].replace("images/", "")}`
                                : "https://via.placeholder.com/60"
                            }
                            alt=""
                            className="order-img"
                          />

                          <div className="order-info">
                            <small>ORDER ID {order._id.slice(-10)}</small>

                            <h6>{item?.productId?.ProductName || item?.productName}</h6>

                            <p>
                              {order.type === "exchange"
                                ? `Will pick up on ${new Date(order.pickupDate || order.createdAt).toDateString()}`
                                : `Arriving on ${new Date(order.deliveryDate || order.createdAt).toDateString()}`}
                            </p>

                            <small>Quantity: {item?.quantity || 0}</small>
                          </div>
                        </div>

                        {/* Button */}
                        <button
                          className="invoice-btn mt-2"
                          onClick={() => downloadInvoice(order._id)}
                        >
                          Download Invoice ⬇
                        </button>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}
            {/* SUPPORT */}
            {active === "support" && (
              <motion.div initial="hidden" animate="visible" variants={fade}>
                <p>You can reach out to us for any complaints or concerns</p>

                <h6 className="fw-bold">care@tolvvsigns.com</h6>

                <div className="mt-4 support-links">

                  <p>
                    <NavLink to="/privacy-policy" className="support-link">
                      Privacy Policy ›
                    </NavLink>
                  </p>

                  <p>
                    <NavLink to="/terms-and-condition" className="support-link">
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
              </motion.div>
            )}

          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default AccountPage;