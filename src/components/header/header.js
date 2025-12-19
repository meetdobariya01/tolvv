import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import "./header.css";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchText.trim()) return;

    navigate(`/product?search=${encodeURIComponent(searchText)}`);
    setShowSearch(false);
    setSearchText("");
  };

  return (
    <>
      <header className="tolvv-header shadow-sm">
        <Navbar expand="lg" expanded={expanded} className="container">
          {/* Mobile Toggle */}
          <Navbar.Toggle
            aria-controls="navbar-nav"
            className="border-0"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          >
            {expanded ? <FiX size={26} /> : <FiMenu size={26} />}
          </Navbar.Toggle>

          {/* Mobile Logo */}
          <Navbar.Brand as={NavLink} to="/" className="mx-auto d-lg-none">
            <img
              src="./images/logo-tolvv.png"
              className="tolvv-logo"
              alt="TOLVV"
            />
          </Navbar.Brand>

          <Navbar.Collapse id="navbar-nav">
            {/* LEFT MENU */}
            <Nav className="left-nav d-flex align-items-center gap-5 mx-auto">
              <NavLink className="menu-text" to="/product">
                PRODUCTS
              </NavLink>
              <NavLink className="menu-text" to="/twelve">
                THE TWELVEs
              </NavLink>
              <NavLink className="menu-text" to="/benefits">
                BENEFITS
              </NavLink>
            </Nav>

            {/* CENTER LOGO (Desktop) */}
            <div className="d-none d-lg-flex justify-content-center mx-4">
              <NavLink to="/" className="logo-link">
                <img
                  src="./images/logo-tolvv.png"
                  className="tolvv-logo"
                  alt="TOLVV"
                />
              </NavLink>
            </div>

            {/* RIGHT MENU */}
            <Nav className="right-nav d-flex align-items-center gap-5 mx-auto">
              <NavLink className="menu-text" to="/know-us">
                KNOW US
              </NavLink>
              <NavLink className="menu-text" to="/faqs">
                FAQs
              </NavLink>
              <NavLink className="menu-text" to="/connect">
                CONNECT
              </NavLink>
            </Nav>
          </Navbar.Collapse>

          {/* ICONS */}
          <div className="icon-area d-flex align-items-center gap-3 ms-auto">
            {/* SEARCH */}
            <button
              className="nav-link p-0 bg-transparent border-0"
              onClick={() => setShowSearch(true)}
            >
              <FiSearch className="header-icon" size={20} />
            </button>

            <NavLink to="/cart" className="nav-link p-0">
              <FiShoppingCart className="header-icon" size={20} />
            </NavLink>

            <NavLink to="/login" className="nav-link p-0">
              <FiUser className="header-icon" size={20} />
            </NavLink>
          </div>
        </Navbar>
      </header>

      {/* SEARCH POPUP */}
      {showSearch && (
        <div className="search-overlay">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            

            <button
              className="close-btn-1"
              onClick={() => setShowSearch(false)}
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
