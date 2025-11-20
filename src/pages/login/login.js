import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./login.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Login = () => {
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
          <h3 className="text-center mb-4 fw-bold">Login to Your Account</h3>

          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                required
                className="form-control pro-input"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                required
                className="form-control pro-input"
                placeholder="Enter password"
              />
            </div>

            {/* ⭐ Forgot Password Link added here */}
            <div className="text-end mb-4">
              <NavLink to="/forgot-password" className="pro-link small">
                Forgot Password?
              </NavLink>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
            >
              Sign In
            </motion.button>

            <p className="text-center mt-3 small">
              Don't have an account?
              <NavLink to="/signup" className="pro-link ms-1">
                Sign up
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

export default Login;
