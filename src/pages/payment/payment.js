import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const customerName = "Meet Patel";
const amount = "1500";

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
          <h2 className="pay-title animate__animated animate__fadeInUp">
            Payment Successful!
          </h2>

          {/* Subtext */}
          <p className="pay-subtitle">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Customer Details */}
          <div className="pay-details animate__animated animate__zoomIn">
            <p>
              <strong>Name:</strong> {customerName}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{amount}
            </p>
          </div>

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
