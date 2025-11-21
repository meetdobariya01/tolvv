import React from "react";
import { NavLink } from "react-router-dom";
import "./error.css";
import "animate.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Error = () => {
  return (
    <div>
      {/* Header section */}
      <Header />

      <div className="error-wrapper d-flex align-items-center justify-content-center">
        <div className="text-center">
          {/* Animation Icon */}
          <div className="error-icon animate__animated animate__bounceIn">
            <img src="/images/error.png" alt="404 Not Found" />
          </div>

          {/* Heading */}
          <h1 className="error-title animate__animated animate__fadeInDown">
            Oops! Page Not Found
          </h1>

          {/* Sub text */}
          <p className="error-subtitle animate__animated animate__fadeInUp">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Back Button */}
          <NavLink
            to="/"
            className="error-btn animate__animated animate__fadeInUp"
          >
            Go Back Home
          </NavLink>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Error;
