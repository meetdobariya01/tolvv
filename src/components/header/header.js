import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { NavLink, useNavigate, useLocation  } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-scroll";
import CartSidebar from "../cartsidebar/cartsidebar";
import "./header.css";
import axios from "axios";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const handleScrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // ✅ FIXED
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/products/search?q=${searchQuery}`,
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300); // 🔥 delay

    return () => clearTimeout(delay);
  }, [searchQuery]);
  // ✅ FIXED CART COUNT FUNCTION
  const updateCartCount = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data?.cart?.items || [];

        const count = items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0,
        );

        setCartCount(count);
      } catch (err) {
        console.error(err);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      const count = guestCart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0,
      );

      setCartCount(count);
    }
  };

  // ✅ EVENT LISTENER
  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => updateCartCount();

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        className="custom-navbar py-3 sora"
        expanded={expanded}
      >
        <Container>
          {/* LOGO */}
          <Navbar.Brand as={NavLink} to="/" className="logo">
            <img
              src="/images/logo-tolvv.png"
              alt="Tolvv Logo"
              className="logo-img"
            />
          </Navbar.Brand>

          {/* MOBILE ICONS */}
          <div className="mobile-icons d-lg-none d-flex align-items-center gap-3">
            {searchOpen ? (
              <FiX onClick={() => setSearchOpen(false)} />
            ) : (
              <FiSearch onClick={() => setSearchOpen(true)} />
            )}

            {/* ✅ CART WITH COUNT (MOBILE) */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              <FiShoppingCart size={22} onClick={() => setShowCart(true)} />

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                    background: "red",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: "12px",
                    padding: "2px 6px",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            <Dropdown align="end" className="sora">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 text-dark"
              >
                <FiUser size={22} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/login">
                  ACCOUNT
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/profile">
                  ORDERS
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>LOGOUT</Dropdown.Item>
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
              <Nav.Link as={NavLink} to="/product">
                PRODUCTS
              </Nav.Link>

              <Nav.Link onClick={() => handleScrollToSection("zodiac")}>
                THE TWELVEs
              </Nav.Link>

              <Nav.Link onClick={() => handleScrollToSection("benefits")}>
                BENEFITS
              </Nav.Link>

              <Nav.Link onClick={() => handleScrollToSection("knowus")}>
                KNOW US
              </Nav.Link>

              <Nav.Link onClick={() => handleScrollToSection("faqs")}>
                FAQs
              </Nav.Link>

              <Nav.Link onClick={() => handleScrollToSection("contact")}>
                CONNECT
              </Nav.Link>
            </Nav>

            {/* DESKTOP ICONS */}
            <div className="icons ms-auto d-none d-lg-flex gap-4">
              {searchOpen ? (
                <FiX onClick={() => setSearchOpen(false)} />
              ) : (
                <FiSearch onClick={() => setSearchOpen(true)} />
              )}

              {/* ✅ CART WITH COUNT (DESKTOP FIXED) */}
              <div style={{ position: "relative", cursor: "pointer" }}>
                <FiShoppingCart size={22} onClick={() => setShowCart(true)} />

                {cartCount > 0 && (
                  <span
                    className="sora"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      background: "black",
                      color: "#fff",
                      borderRadius: "15%",
                      fontSize: "12px",
                      padding: "0px 6px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <Dropdown align="end" className="sora">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 border-0 text-dark dropdown-toggle-no-icon"
                >
                  <FiUser size={22} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/login">
                    ACCOUNT
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/profile">
                    ORDERS
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>LOGOUT</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>

        {/* SEARCH */}
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
                <div style={{ position: "relative" }}>
                  <FormControl
                    type="search"
                    placeholder="Search products..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {searchQuery && (
                    <FiX
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    />
                  )}
                </div>
              </Form>

              {/* ✅ DROPDOWN */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "500px",
                    zIndex: 9999,
                  }}
                >
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        background: "blur(10px) rgba(245, 155, 155, 0.8)",
                      }}
                      onClick={() => {
                        navigate(`/productdetails/${item._id}`);
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      {item.ProductName}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Navbar>

      <CartSidebar show={showCart} handleClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
