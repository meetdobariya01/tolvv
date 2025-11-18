import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {
    const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <header className="header-section py-3">
        <nav className="container d-flex justify-content-around align-items-center flex-wrap">
          {/* Left Menu */}
          <div className="d-flex align-items-center gap-5 left-menu header-text">
            <a href="#products" className="nav-link">
              PRODUCTS
            </a>
            <a href="#twelves" className="nav-link">
              THE TWELVEs
            </a>
            <a href="/benefits" className="nav-link">
              BENEFITS
            </a>
          </div>

          {/* Center Logo */}
          <div className="logo-container text-center">
            <div className="logo-box">
              <NavLink to="/" className="logo-link">
                <img
                  src="./images/logo.png" // ← your logo image path
                  alt="Twelve Logo"
                  className="logo-image"
                />
              </NavLink>
            </div>
          </div>

          {/* Right Menu */}
          <div className="d-flex align-items-center gap-5 right-menu header-text">
            <a href="/know-us" className="nav-link">
              KNOW US
            </a>
            <a href="/faqs" className="nav-link">
              FAQs
            </a>
            <a href="/connect" className="nav-link">
              CONNECT
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
