import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import Header from "../header/header";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/admin";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  setLoading(true);
  setServerError("");

  try {
    const res = await axios.post(`${API_BASE}/login`, formData);

    const { token, admin } = res.data;

    // ✅ IMPORTANT: store using adminToken (matches orders page)
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminData", JSON.stringify(admin));
    localStorage.setItem("role", "admin");

    // ✅ Redirect to dashboard
    navigate("/admin/dashboard");

  } catch (error) {
    setServerError(
      error.response?.data?.message || "Login failed. Try again."
    );
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
          <h3 className="text-center mb-4 fw-bold">Admin Login</h3>

          {serverError && (
            <div className="alert alert-danger text-center">{serverError}</div>
          )}

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
              {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control pro-input"
                placeholder="Enter password"
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 py-2 pro-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Admin Sign In"}
            </motion.button>

            <p className="text-center mt-3 small">
              Not admin?
              <NavLink to="/" className="pro-link ms-1">
                User Login
              </NavLink>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
