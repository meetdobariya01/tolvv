import React, { useState } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Dropdown } from "react-bootstrap";
import "./header.css";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Navbar expand="lg" className="custom-navbar py-3" expanded={expanded}>
        <Container>
          {/* Logo */}
          <Navbar.Brand as={NavLink} to="/" className="logo">
            <img
              src="/images/logo-tolvv.png"
              alt="Tolvv Logo"
              className="logo-img"
            />
          </Navbar.Brand>

          {/* Mobile Toggle */}
          {/* Mobile Icons */}
          <div className="mobile-icons d-lg-none d-flex align-items-center gap-3">
            {searchOpen ? (
              <FiX onClick={() => setSearchOpen(false)} />
            ) : (
              <FiSearch onClick={() => setSearchOpen(true)} />
            )}

            <NavLink to="/cart" className="text-dark">
              <FiShoppingCart size={22} />
            </NavLink>
            <Dropdown align="end" className="sora">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 text-dark"
                id="user-dropdown"
              >
                <FiUser size={22} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/login">
                  Login
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/profile">
                  Profile
                </Dropdown.Item>
         
                <Dropdown.Divider />
                <Dropdown.Item as={NavLink} to="/logout">
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
            <Nav className="mx-auto nav-links gap-0 gap-lg-4">
              <Nav.Link as={NavLink} to="/product">
                PRODUCTS
              </Nav.Link>
              <Nav.Link as={NavLink} to="/twelve">
                THE TWELVEs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/benefits">
                BENEFITS
              </Nav.Link>
              <Nav.Link as={NavLink} to="/know-us">
                KNOW US
              </Nav.Link>
              <Nav.Link as={NavLink} to="/faqs">
                FAQs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/connect">
                CONNECT
              </Nav.Link>
            </Nav>

            {/* Right Icons */}
            <div className="icons d-none d-lg-flex gap-4">
              {searchOpen ? (
                <FiX onClick={() => setSearchOpen(false)} />
              ) : (
                <FiSearch onClick={() => setSearchOpen(true)} />
              )}
              <NavLink to="/cart" className="text-dark">
                <FiShoppingCart size={22} />
              </NavLink>
              <Dropdown align="end" className="sora">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 border-0 text-dark"
                  id="user-dropdown"
                >
                  <FiUser size={22} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/login">
                    Login
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/profile">
                    Profile
                  </Dropdown.Item>
                 
                  <Dropdown.Divider />
                  <Dropdown.Item as={NavLink} to="/logout">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>

        {/* Animated Search Bar */}
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
    </>
  );
};

export default Header;
