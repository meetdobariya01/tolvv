import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./password.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Forgotpassword = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP, 3 = reset password
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:3000"; // adjust if deployed

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/forgot-password`, { mobile });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/verify-reset-otp`, { mobile, Otp: otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/reset-password`, { mobile, newPassword });
      setMessage(res.data.message);
      setStep(1);
      setMobile("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div>
      <Header />

      <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pro-login-card p-5 rounded-4 shadow-sm"
        >
          <h3 className="text-center mb-3 fw-bold">Forgot Password</h3>

          {message && <p className="text-center text-success">{message}</p>}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="form-control pro-input"
                  placeholder="Enter your mobile number"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 py-2 pro-btn"
              >
                Send OTP
              </motion.button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Enter OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control pro-input"
                  placeholder="Enter OTP"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 py-2 pro-btn"
              >
                Verify OTP
              </motion.button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control pro-input"
                  placeholder="Enter new password"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 py-2 pro-btn"
              >
                Reset Password
              </motion.button>
            </form>
          )}

          <p className="text-center mt-3 small">
            Remember your password?
            <NavLink to="/login" className="pro-link ms-1">
              Back to Login
            </NavLink>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Forgotpassword;
