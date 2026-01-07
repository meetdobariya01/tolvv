import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { FaInstagram, FaEnvelope } from "react-icons/fa";
import WhatsappButton from "../whatsapp/whatsapp";
import "./footer.css";

export const Footer = () => {
  return (
    <div>
      <footer
        className="text-white py-5"
        style={{
          backgroundColor: "#4A4646",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="container">
          <div className="row gy-4 footer sora">
            {/* Column 1 */}
            <div className="col-md-3 col-6">
              <h6 className="fw-bold text-uppercase mb-3">Discover</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Bath Gel
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Body Lotion
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Soap
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Eau de Parfum
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Essential Oil
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/product" className="footer-link">
                    Gift Box
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="col-md-3 col-6">
              <h6 className="fw-bold text-uppercase mb-3">Know Us</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <a href="/connect" className="footer-link">
                    Connect
                  </a>
                </li>

                <li className="mb-2">
                  <a
                    href="https://www.instagram.com/tolvvsigns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Instagram
                  </a>
                </li>

                <li className="mb-2">
                  <a
                    href="https://wa.me/919824257356"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="d-flex align-items-center gap-3 mt-3">
                <a
                  href="https://www.instagram.com/tolvvsigns?igsh=cmhmN244cnVjbnM%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  style={{
                    fontSize: "20px",
                    border: "1px solid white",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaInstagram />
                </a>
                <a
                  href="mailto:care@tolvvsigns.com"
                  className="text-white"
                  style={{
                    fontSize: "20px",
                    border: "1px solid white",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Column 3 */}
            <div className="col-md-3 col-6">
              <h6 className="fw-bold text-uppercase mb-3">Policy</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <NavLink to="/privacy-policy" className="footer-link">
                    Privacy policy
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/terms-and-condition" className="footer-link">
                    Terms & Conditions
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/shipping-policy" className="footer-link">
                    Shipping policy
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink to="/refund-policy" className="footer-link">
                    Refund policy
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Column 4 (Logo + Copyright) */}
            <div className="col-md-3 text-center text-md-end">
              <div>
                <img
                  src="images/logo-footer.png"
                  alt="Twelve Logo"
                  style={{ maxHeight: "120px", marginBottom: "10px" }}
                />
              </div>
              <p
                className="small text-uppercase mb-0"
                style={{ letterSpacing: "0.5px", color: "#D6D6D6" }}
              >
                Copyright 2025. Tolvv <br />
                All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>

      <WhatsappButton />
    </div>
  );
};
export default Footer;
