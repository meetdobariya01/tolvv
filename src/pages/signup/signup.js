import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./signup.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Signup = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pro-login-card p-5 rounded-4 shadow-sm"
        >
          <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>

          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                required
                className="form-control pro-input"
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                required
                className="form-control pro-input"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                required
                className="form-control pro-input"
                placeholder="Create password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
            >
              Sign Up
            </motion.button>

            <p className="text-center mt-3 small">
              Already have an account?
              <NavLink to="/login" className="pro-link ms-1">
                Login
              </NavLink>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Signup;
