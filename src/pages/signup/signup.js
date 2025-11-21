import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import "./signup.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const api_base = "http://localhost:3000";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fname: "", lname: "", mobile: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fname) newErrors.fname = "First name is required";
    if (!formData.lname) newErrors.lname = "Last name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!otpVerified) newErrors.otp = "Mobile number must be verified via OTP";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setErrors({ mobile: "Enter mobile number first" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(`${api_base}/send-otp`, { mobile: formData.mobile });
      if (res.data.success) setOtpSent(true);
    } catch (err) {
      console.error(err);
      setServerError("Failed to send OTP. Try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors({ otp: "Enter OTP" });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(`${api_base}/verify-otp`, { mobile: formData.mobile, Otp: otp });
      if (res.data.success) {
        setOtpVerified(true);
        setErrors({});
      }
    } catch (err) {
      console.error(err);
      setErrors({ otp: "Invalid or expired OTP" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      await axios.post(`${api_base}/signup`, formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
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
          <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                name="fname"
                className="form-control pro-input"
                placeholder="Enter first name"
                value={formData.fname}
                onChange={handleChange}
              />
              {errors.fname && <small className="text-danger">{errors.fname}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                name="lname"
                className="form-control pro-input"
                placeholder="Enter last name"
                value={formData.lname}
                onChange={handleChange}
              />
              {errors.lname && <small className="text-danger">{errors.lname}</small>}
            </div>

            {/* Mobile + OTP */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Mobile Number</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  name="mobile"
                  className="form-control pro-input"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  disabled={otpLoading || otpVerified}
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </div>

              {otpSent && !otpVerified && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control pro-input"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                  />
                </div>
              )}

              {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
              {errors.otp && <small className="text-danger d-block">{errors.otp}</small>}
              {otpVerified && <small className="text-success d-block">Mobile number verified ✅</small>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control pro-input"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            {serverError && <p className="text-danger text-center">{serverError}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
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
      <Footer />
    </div>
  );
};

export default Signup;
