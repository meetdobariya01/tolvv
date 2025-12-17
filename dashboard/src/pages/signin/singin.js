import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import "./singin.css";
import Header from "../header/header";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/register";

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.fname) newErrors.fname = "First name required";
    if (!formData.lname) newErrors.lname = "Last name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.mobile) newErrors.mobile = "Mobile required";
    if (!formData.password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      await axios.post(API_URL, formData);
      alert("Admin Registered Successfully ✅");
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
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
          <h3 className="text-center mb-4 fw-bold">Admin Registration</h3>

          <form onSubmit={handleSubmit}>

            <input type="text" name="fname" placeholder="First Name"
              className="form-control mb-2" onChange={handleChange} />
            {errors.fname && <small className="text-danger">{errors.fname}</small>}

            <input type="text" name="lname" placeholder="Last Name"
              className="form-control mb-2" onChange={handleChange} />
            {errors.lname && <small className="text-danger">{errors.lname}</small>}

            <input type="email" name="email" placeholder="Email"
              className="form-control mb-2" onChange={handleChange} />
            {errors.email && <small className="text-danger">{errors.email}</small>}

            <input type="text" name="mobile" placeholder="Mobile"
              className="form-control mb-2" onChange={handleChange} />
            {errors.mobile && <small className="text-danger">{errors.mobile}</small>}

            <input type="password" name="password" placeholder="Password"
              className="form-control mb-3" onChange={handleChange} />
            {errors.password && <small className="text-danger">{errors.password}</small>}

            {serverError && <p className="text-danger">{serverError}</p>}

            <motion.button
              type="submit"
              className="btn w-100 py-2 pro-btn"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>

            <p className="text-center mt-3 small">
              Already Admin?
              <NavLink to="/login" className="ms-1">Login</NavLink>
            </p>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
