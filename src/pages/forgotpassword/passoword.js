import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./password.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Forgotpassword = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pro-login-card p-5 rounded-4 shadow-sm"
        >
          <h3 className="text-center mb-3 fw-bold">Forgot Password?</h3>

          <p
            className="text-center text-muted mb-4"
            style={{ fontSize: "14px" }}
          >
            Enter your registered email address. We will send you a password
            reset link.
          </p>

          <form>
            <div className="mb-4">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                required
                className="form-control pro-input"
                placeholder="Enter your email"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
            >
              Send Reset Link
            </motion.button>

            <p className="text-center mt-3 small">
              Remember your password?
              <NavLink to="/login" className="pro-link ms-1">
                Back to Login
              </NavLink>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Forgotpassword;
