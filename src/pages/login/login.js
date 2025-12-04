import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const api_base = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_base}/login`, formData);
      const { token, role, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      navigate("/");
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
          <h3 className="text-center mb-4 fw-bold">Login to Your Account</h3>

          {serverError && <div className="alert alert-danger text-center">{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control pro-input"
                placeholder="Enter mobile number"
              />
              {errors.mobile && <div className="text-danger small mt-1">{errors.mobile}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control pro-input"
                placeholder="Enter password"
              />
              {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            </div>

            {/* Forgot password link */}
            <div className="text-end mb-4">
              <NavLink to="/forgot-password" className="pro-link small">
                Forgot Password?
              </NavLink>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
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
      <Footer />
    </div>
  );
};

export default Login;
