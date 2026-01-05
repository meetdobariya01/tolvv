// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./login.css";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";

// const api_base = process.env.REACT_APP_API_URL;

// const Login = () => {
//   const navigate = useNavigate();

//   // 🔁 mobile -> email (logic only)
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email is required";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setErrors({});
//     setServerError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(`${api_base}/login`, formData);
//       const { token, role, userId } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("userId", userId);

//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       setServerError(
//         err.response?.data?.message || "Server error. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="pro-login-card p-5 rounded-4 shadow-sm"
//         >
//           <h3 className="text-center mb-4 fw-bold">Login to Your Account</h3>

//           {serverError && (
//             <div className="alert alert-danger text-center">
//               {serverError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="form-control pro-input"
//                 placeholder="Enter email"
//               />
//               {errors.email && (
//                 <div className="text-danger small mt-1">
//                   {errors.email}
//                 </div>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-2">
//               <label className="form-label fw-semibold">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="form-control pro-input"
//                 placeholder="Enter password"
//               />
//               {errors.password && (
//                 <div className="text-danger small mt-1">
//                   {errors.password}
//                 </div>
//               )}
//             </div>

//             {/* Forgot password */}
//             <div className="text-end mb-4">
//               <NavLink to="/forgot-password" className="pro-link small">
//                 Forgot Password?
//               </NavLink>
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="btn w-100 py-2 pro-btn"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Signing In..." : "Sign In"}
//             </motion.button>

//             <p className="text-center mt-3 small">
//               Don't have an account?
//               <NavLink to="/signup" className="pro-link ms-1">
//                 Sign up
//               </NavLink>
//             </p>
//           </form>
//         </motion.div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";

// Temporary placeholders for Header and Footer
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const api_base = process.env.REACT_APP_API_URL;

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

  // -----------------------------
  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post(`${api_base}/login`, formData);
      const { token, role, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "user");
      localStorage.setItem("userId", user?.id);

      navigate("/");
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;
      if (!credential) throw new Error("Google login failed");

      const res = await axios.post(`${api_base}/googlelogin`, { token: credential });
      const { token: jwtToken } = res.data;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("role", "user");

      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      setServerError(err.response?.data?.message || "Google login failed");
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
          <h3 className="text-center mb-4 fw-bold">Hello</h3>

          {serverError && (
            <div className="alert alert-danger text-center">{serverError}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold"></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control pro-input"
                placeholder="Enter email"
              />
              {errors.email && (
                <div className="text-danger small mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="form-label fw-semibold"></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control pro-input"
                placeholder="Enter password"
              />
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password}</div>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-end mb-4">
              <NavLink to="/forgot-password" className="pro-link small text-dark  ">
                Forgot Password?
              </NavLink>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline-dark w-100 py-2 "
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            {/* Signup link */}
            <p className="text-center mt-3 small">
              Don't have an account?
              <NavLink to="/signup" className="pro-link text-dark ms-1">
                Sign up
              </NavLink>
            </p>
          </form>

          {/* Google Login */}
          <div className="text-center mt-3">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setServerError("Google login failed")}
            />
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
