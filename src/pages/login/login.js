import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const api_base = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
const location = useLocation();
const redirectPath = location.state?.from || "/";
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
  const guestCart = localStorage.getItem("guestCart");
  if (!guestCart) return;

  const guestItems = JSON.parse(guestCart);

  try {
    await axios.post(
      `${api_base}/cart/merge`,
      { guestItems },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ CLEAR AFTER MERGE
    localStorage.removeItem("guestCart");

  } catch (err) {
    console.error("Merge cart error:", err);
  }
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

      navigate(redirectPath);
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

      navigate("/");
    } catch (err) {
      setServerError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="login-3-container sora">
        {/* SECTION 1 - IMAGE */}
        <div className="login-section image-section">
          <img
            src="./images/login-page.png"
            alt="login"
          />
        </div>

        {/* SECTION 2 - HELLO TEXT */}
        <div className="login-section-1 hello-section artisan-font">
          <h1>Hello</h1>
        </div>

        {/* SECTION 3 - FORM */}
        <div className="login-section form-section-1  ">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="form-box"
          >
            {serverError && <div className="error-box">{serverError}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                className="input-line"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-line"
              />

              <p className="forgot">Forgot Password</p>

              <button className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="divider">or</div>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setServerError("Google login failed")}
            />

            {/* <button className="apple-btn">Sign in with Apple</button> */}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
