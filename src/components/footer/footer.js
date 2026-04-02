import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <footer className="footer-section sora">
      <div className="container">
        <div className="row">
          {/* Useful Links */}
          <div className="col-lg-3 col-md-6 mb-4 footer-col">
            <h6 className="footer-title">USEFUL LINKS</h6>
            <ul className="footer-links">
              <li>
                <NavLink
                  to="zodiac"
                  smooth
                  duration={500}
                  className="nav-link"
                ></NavLink>
              </li>
              <li>
                {" "}
                <Link to="zodiac" smooth duration={500} className="nav-link">
                  Zodiac Calculator
                </Link>
              </li>
              <li>
                {" "}
                <Link to="benefits" smooth duration={500} className="nav-link">
                  Benefits
                </Link>
              </li>
              <li>
                {" "}
                <Link to="knowus" smooth duration={500} className="nav-link">
                  Know Us Better
                </Link>
              </li>
              <li>
                {" "}
                <Link to="faqs" smooth duration={500} className="nav-link">
                  FAQs
                </Link>
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

            <div className="mt-5">
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
            <p className="footer-text-1 ">
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

            <div className="social-icons">
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
              {/* Text */}
              <div className="footer-copy">
                <p>2026 . tolvvsigns.com</p>
                <p>All rights reserved.</p>
              </div>

              {/* Logo */}
              <img
                src="/images/logo-footer.png"
                alt="logo"
                className="footer-logo"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
      </div>
    </footer>
  );
};

export default Footer;
