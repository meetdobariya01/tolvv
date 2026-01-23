import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";



const Payment = () => {
  return (
    <div>
      {/* Header section*/}
      <Header />

      <div className="pay-wrapper">
        <div className="pay-card animate__animated animate__fadeInDown">
          {/* Success Icon */}
          <div className="pay-icon">
            <div className="checkmark"></div>
          </div>

          {/* Heading */}
          {/* <h2 className="pay-title animate__animated animate__fadeInUp">
            Payment Successful!
          </h2> */}
          <h2 className="pay-title animate__animated animate__fadeInUp">
            Order Conformed!
          </h2>
          {/* Subtext */}
          <p className="pay-subtitle">
            Thank you for your purchase.
          </p>

          {/* Customer Details */}
        

          {/* Button */}
          <NavLink
            to="/"
            className="pay-btn animate__animated animate__fadeInUp"
          >
            Continue Shopping
          </NavLink>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Payment;
