import React, { useState } from "react";
import { Navbar, Nav, Container, Form, FormControl, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import CartSidebar from "../cartsidebar/cartsidebar";
import "./header.css";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const navigate = useNavigate(); // ✅

  // ✅ SAME LOGIC AS ACCOUNT PAGE
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar expand="lg" className="custom-navbar py-3" expanded={expanded}>
        <Container>

          {/* LOGO */}
          <Navbar.Brand as={NavLink} to="/" className="logo">
            <img src="/images/logo-tolvv.png" alt="Tolvv Logo" className="logo-img" />
          </Navbar.Brand>

          {/* MOBILE ICONS */}
          <div className="mobile-icons d-lg-none d-flex align-items-center gap-3">
            
            {searchOpen ? (
              <FiX onClick={() => setSearchOpen(false)} />
            ) : (
              <FiSearch onClick={() => setSearchOpen(true)} />
            )}

            <FiShoppingCart size={22} onClick={() => setShowCart(true)} />

            <Dropdown align="end" className="sora">
              <Dropdown.Toggle variant="link" className="p-0 border-0 text-dark">
                <FiUser size={22} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/login">Login</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>

                <Dropdown.Divider />

                {/* ✅ FIXED LOGOUT */}
                <Dropdown.Item onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {expanded ? (
              <FiX onClick={() => setExpanded(false)} />
            ) : (
              <FiMenu onClick={() => setExpanded(true)} />
            )}
          </div>

          <Navbar.Collapse>
            <Nav className="nav-links gap-0">
              <Nav.Link as={NavLink} to="/product">ALL SUN SIGNS</Nav.Link>

              <Link to="zodiac" smooth duration={500} className="nav-link">THE TWELVEs</Link>
              <Link to="benefits" smooth duration={500} className="nav-link">BENEFITS</Link>
              <Link to="knowus" smooth duration={500} className="nav-link">KNOW US</Link>
              <Link to="faqs" smooth duration={500} className="nav-link">FAQs</Link>
              <Link to="contact" smooth duration={500} className="nav-link">CONNECT</Link>
            </Nav>

            {/* DESKTOP ICONS */}
            <div className="icons mx-auto d-none d-lg-flex gap-4">
              
              {searchOpen ? (
                <FiX onClick={() => setSearchOpen(false)} />
              ) : (
                <FiSearch onClick={() => setSearchOpen(true)} />
              )}

              <FiShoppingCart size={22} onClick={() => setShowCart(true)} />

              <Dropdown align="end" className="sora">
                <Dropdown.Toggle variant="link" className="p-0 border-0 text-dark">
                  <FiUser size={22} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/login">Login</Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>

                  <Dropdown.Divider />

                  {/* ✅ FIXED LOGOUT */}
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

          </Navbar.Collapse>
        </Container>

        {/* SEARCH BAR */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="search-bar"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Form className="search-form">
                <FormControl
                  type="search"
                  placeholder="Search products..."
                  className="search-input"
                />
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </Navbar>

      <CartSidebar show={showCart} handleClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;