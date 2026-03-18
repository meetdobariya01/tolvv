import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";
import Cookies from "js-cookie";

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const api_base = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const validate = () => {
    if (!formData.email.trim()) {
      setServerError("Email is required");
      return false;
    }

    if (!formData.password.trim()) {
      setServerError("Password is required");
      return false;
    }

    return true;
  };

  // -----------------------------
  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const mergeGuestCart = async (token) => {
  //   const guestCart = Cookies.get("guestCart");
  //   if (!guestCart) return;

  //   const guestItems = JSON.parse(guestCart);

  //   await axios.post(
  //     `${api_base}/merge`,
  //     { guestItems },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );

  //   Cookies.remove("guestCart");
  // };

  // -----------------------------
  // Merge guest cart
  const mergeGuestCart = async (token) => {
    const guestCart = Cookies.get("guestCart");
    if (!guestCart) return;

    const guestItems = JSON.parse(guestCart);

    await axios.post(
      `${api_base}/cart/merge`,
      { guestItems },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    Cookies.remove("guestCart");
  };

  // -----------------------------
  // Email / Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_base}/auth/login`, formData);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ CORRECT FUNCTION CALL
      await mergeGuestCart(token);

      navigate("/Check-out");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);

    try {
      const { credential } = credentialResponse;

      const res = await axios.post(`${api_base}/auth/googlelogin`, {
        token: credential,
      });

      const { token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await mergeGuestCart(token);

      navigate("/Check-out");
    } catch (err) {
      setServerError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="pro-loginpage-wrapper d-flex align-items-center justify-content-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pro-loginpage-card p-5 rounded-4 shadow-sm"
        >
          <h3 className="text-center mb-4 fw-bold">Welcome</h3>

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
              className="form-control mb-3 underline-input"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3 underline-input"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="btn btn-outline-dark w-100" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setServerError("Google login failed")}
          />

          <p className="text-center mt-3">
            No account?{" "}
            <NavLink className="text-decoration-none text-dark" to="/signup">
              Sign up
            </NavLink>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
