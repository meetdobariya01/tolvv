import React, { useEffect } from "react";
import "./footer.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { scroller } from "react-scroll";

// Custom component that replaces react-scroll Link
const ScrollToSection = ({ to, smooth = true, duration = 500, children, className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page → scroll directly
      scroller.scrollTo(to, { smooth, duration });
    } else {
      // Navigate to home and pass target section via state
      navigate("/", { state: { scrollTo: to } });
    }
  };

  return (
    <a href={`/#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="footer-section text-center text-md-start sora">
      <div className="container">
        <div className="row">
          {/* Useful Links */}
          <div className="col-lg-3 col-md-6 mb-4 footer-col">
            <h6 className="footer-title">USEFUL LINKS</h6>
            <ul className="footer-links">
              <li>
                <ScrollToSection to="zodiac" className="nav-link">
                  Zodiac Calculator
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection to="benefits" className="nav-link">
                  Benefits
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection to="knowus" className="nav-link">
                  Know Us Better
                </ScrollToSection>
              </li>
              <li>
                <ScrollToSection to="faqs" className="nav-link">
                  FAQs
                </ScrollToSection>
              </li>
              <li>
                <NavLink to="/privacy-policy" className="nav-link">
                  Policies
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms-and-condition" className="nav-link">
                  Terms Of Use
                </NavLink>
              </li>
            </ul>

            <div className="mt-0 mt-lg-5">
              <h6 className="footer-subtitle">BULK / CORPORATE ORDERS</h6>
              <p className="footer-text">
                <a
                  className="text-light text-decoration-none"
                  href="mailto:corporategifting@tolvvsigns.in"
                >
                  corporategifting@tolvvsigns.in
                </a>
              </p>
            </div>
          </div>

          {/* My Account */}
          <div className="col-lg-3 col-md-6 mb-4 footer-col">
            <h6 className="footer-title">MY ACCOUNT</h6>
            <ul className="footer-links">
              <li>
                <NavLink className="nav-link" to="/profile">
                  Account
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="/login">
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="/profile">
                  Addresses
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-lg-3 col-md-6 mb-4 footer-col">
            <h6 className="footer-title">CONNECT WITH US</h6>
            <p className="footer-text-1">
              <a
                className="text-light text-decoration-none"
                href="mailto:care@tolvvsigns.com"
              >
                care@tolvvsigns.com
              </a>
            </p>
            <p className="footer-text-1">
              <a
                className="text-light text-decoration-none"
                href="tel:+919824257356"
              >
                +91 98242 57356
              </a>
            </p>

            <div className="social-icons d-flex justify-content-center justify-content-lg-start">
              <a
                href="https://www.instagram.com/tolvvsigns?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/919824257356?text=Hello%20Tolvv%20Signs%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Right Vertical Branding */}
          <div className="col-lg-3 d-none d-lg-flex align-items-end mb-3 justify-content-end">
            <div className="footer-right d-flex align-items-end gap-3">
              <div className="footer-copy">
                <p>2026 . tolvvsigns.com</p>
                <p>All rights reserved.</p>
              </div>
              <img
                src="/images/logo-tolvv.png"
                alt="logo"
                className="footer-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;