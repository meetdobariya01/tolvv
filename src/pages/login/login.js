import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";
import Cookies from "js-cookie";

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const api_base = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const mergeGuestCart = async (token) => {
  const guestCart = Cookies.get("guestCart");
  if (!guestCart) return;

  const guestItems = JSON.parse(guestCart);

  await axios.post(
    "http://localhost:4000/merge",
    { guestItems },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  Cookies.remove("guestCart");
};



  // -----------------------------
  // Email / Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_base}/login`, formData);
      const { token, role, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "user");
      localStorage.setItem("userId", userId);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ CORRECT FUNCTION CALL
   await mergeGuestCart(token);


      navigate("/cart");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Google login
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;

      const res = await axios.post(`${api_base}/googlelogin`, {
        token: credential,
      });

      const { token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await mergeGuestCart(token);

      navigate("/cart");
    } catch (err) {
      setServerError("Google login failed");
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
          className="pro-loginpage-card p-5 rounded-4 shadow-sm"
        >
          <h3 className="text-center mb-4 fw-bold">Sign In</h3>

          {serverError && (
            <div className="alert alert-danger text-center small py-2">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center my-3">OR</div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setServerError("Google login failed")}
          />

          <p className="text-center mt-3">
            No account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
