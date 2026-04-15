import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setServerError(""); // Clear error on input
  };

  // Merge guest cart after login
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
      localStorage.removeItem("guestCart");
      console.log("✅ Guest cart merged successfully");
    } catch (err) {
      console.error("Merge cart error:", err);
    }
  };

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_base}/auth/login`, formData);

      if (res.data.success) {
        const { token, user } = res.data;

        // Store user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Merge guest cart if exists
        await mergeGuestCart(token);

        // Redirect to previous page or home
        navigate(redirectPath, { replace: true });
      } else {
        setServerError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setServerError("");

    try {
      const { credential } = credentialResponse;

      const res = await axios.post(`${api_base}/auth/googlelogin`, {
        token: credential,
      });

      if (res.data.success) {
        const { token, user } = res.data;

        // Store user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Merge guest cart if exists
        await mergeGuestCart(token);

        // Redirect to previous page or home
        navigate(redirectPath, { replace: true });
      } else {
        setServerError(res.data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setServerError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setServerError("Google login failed. Please try again.");
  };

  return (
    <div>
      <Header />
      <div className="login-3-container sora">
        {/* SECTION 1 - IMAGE */}
        <div className="login-section image-section">
          <img src="./images/login-page.png" alt="login" />
        </div>

        {/* SECTION 2 - HELLO TEXT */}
        <div className="login-section-1 hello-section artisan-font">
          <h1>Hello</h1>
   
        </div>

        {/* SECTION 3 - FORM */}
        <div className="login-section form-section-1">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="form-box"
          >
            {serverError && (
              <div className="error-box">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="input-line"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-line"
                required
              />

              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                logo_alignment="center"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;