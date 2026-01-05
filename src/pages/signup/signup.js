// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./signup.css";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";

// const api_base = process.env.REACT_APP_API_URL;

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     email: "",
//     mobile: "",
//     password: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ✅ VALIDATION (NO MOBILE VERIFICATION)
//   const validate = () => {
//     const err = {};
//     if (!formData.fname) err.fname = "First name is required";
//     if (!formData.lname) err.lname = "Last name is required";
//     if (!formData.email) err.email = "Email is required";
//     if (!formData.mobile) err.mobile = "Mobile number is required";
//     if (!formData.password) err.password = "Password is required";
//     if (!otpVerified) err.otp = "Email must be verified via OTP";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // 📩 SEND EMAIL OTP
//   const handleSendOtp = async () => {
//     if (!formData.email) {
//       setErrors({ email: "Enter email first" });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       const res = await axios.post(`${api_base}/send-otp`, {
//         email: formData.email,
//       });

//       if (res.data.success) {
//         setOtpSent(true);
//         setErrors({});
//       }
//     } catch (err) {
//       setServerError(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // ✅ VERIFY EMAIL OTP
//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       setErrors({ otp: "Enter OTP" });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       const res = await axios.post(`${api_base}/verify-otp`, {
//         email: formData.email,
//         otp,
//       });

//       if (res.data.success) {
//         setOtpVerified(true);
//         setErrors({});
//       }
//     } catch (err) {
//       setErrors({ otp: "Invalid or expired OTP" });
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // 🚀 SIGNUP
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     setServerError("");

//     try {
//       await axios.post(`${api_base}/signup`, formData);
//       navigate("/login");
//     } catch (err) {
//       setServerError(err.response?.data?.message || "Server error");
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
//           <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>

//           <form onSubmit={handleSubmit}>
//             {/* First Name */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">First Name</label>
//               <input
//                 type="text"
//                 name="fname"
//                 className="form-control pro-input"
//                 value={formData.fname}
//                 onChange={handleChange}
//               />
//               {errors.fname && <small className="text-danger">{errors.fname}</small>}
//             </div>

//             {/* Last Name */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Last Name</label>
//               <input
//                 type="text"
//                 name="lname"
//                 className="form-control pro-input"
//                 value={formData.lname}
//                 onChange={handleChange}
//               />
//               {errors.lname && <small className="text-danger">{errors.lname}</small>}
//             </div>

//             {/* Mobile (NO VERIFICATION) */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Mobile Number</label>
//               <input
//                 type="text"
//                 name="mobile"
//                 className="form-control pro-input otp"
//                 value={formData.mobile}
//                 onChange={handleChange}
//               />
//               {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
//             </div>

//             {/* Email + OTP */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Email</label>
//               <div className="d-flex gap-2">
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control pro-input"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={otpVerified}
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-outline-primary"
//                   onClick={otpSent ? handleVerifyOtp : handleSendOtp}
//                   disabled={otpLoading || otpVerified}
//                 >
//                   {otpSent ? "Verify OTP" : "Send OTP"}
//                 </button>
//               </div>

//               {otpSent && !otpVerified && (
//                 <input
//                   type="text"
//                   className="form-control pro-input mt-2"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                 />
//               )}

//               {otpVerified && (
//                 <small className="text-success d-block">
//                   Email verified ✅
//                 </small>
//               )}
//               {errors.otp && <small className="text-danger">{errors.otp}</small>}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="form-label fw-semibold">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control pro-input"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {errors.password && <small className="text-danger">{errors.password}</small>}
//             </div>

//             {serverError && <p className="text-danger text-center">{serverError}</p>}

//             <motion.button
//               className="btn w-100 py-2 pro-btn"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </motion.button>

//             <p className="text-center mt-3 small">
//               Already have an account?
//               <NavLink to="/login" className="pro-link ms-1">
//                 Login
//               </NavLink>
//             </p>
//           </form>
//         </motion.div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Signup;



// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { NavLink, useNavigate } from "react-router-dom";
// import "./signup.css";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";

// const api_base = process.env.REACT_APP_API_URL;

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     email: "",
//     mobile: "",
//     password: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);

//   // =========================
//   // GOOGLE LOGIN INIT
//   // =========================
//   useEffect(() => {
//     if (window.google) {
//       window.google.accounts.id.initialize({
//         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//         callback: handleGoogleResponse,
//       });
//       window.google.accounts.id.renderButton(
//         document.getElementById("google-btn"),
//         {
//           theme: "outline",
//           size: "large",
//           width: "100%",
//         }
//       );
//     }
//   }, []);

//   const handleGoogleResponse = async (response) => {
//     try {
//       const res = await axios.post(`${api_base}/googlelogin`, {
//         token: response.credential,
//       });
//       localStorage.setItem("token", res.data.token);
//       navigate("/");
//     } catch (error) {
//       console.error("Google login failed", error.response?.data || error);
//       setServerError(error.response?.data?.message || "Google login failed");
//     }
//   };

//   // =========================
//   // FORM HANDLERS
//   // =========================
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const validate = () => {
//     const err = {};
//     if (!formData.fname) err.fname = "First name is required";
//     if (!formData.lname) err.lname = "Last name is required";
//     if (!formData.email) err.email = "Email is required";
//     if (!formData.mobile) err.mobile = "Mobile number is required";
//     if (!formData.password) err.password = "Password is required";
//     if (!otpVerified) err.otp = "Email must be verified via OTP";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // =========================
//   // OTP EMAIL
//   // =========================
//   const handleSendOtp = async () => {
//     if (!formData.email) {
//       setErrors({ email: "Enter email first" });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       const res = await axios.post(`${api_base}/send-otp`, {
//         email: formData.email,
//       });
//       if (res.data.success) {
//         setOtpSent(true);
//         setErrors({});
//       }
//     } catch (err) {
//       setServerError(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       setErrors({ otp: "Enter OTP" });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       const res = await axios.post(`${api_base}/verify-otp`, {
//         email: formData.email,
//         otp,
//       });
//       if (res.data.success) {
//         setOtpVerified(true);
//         setErrors({});
//       }
//     } catch (err) {
//       setErrors({ otp: "Invalid or expired OTP" });
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // =========================
//   // SIGNUP SUBMIT
//   // =========================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     setServerError("");

//     try {
//       await axios.post(`${api_base}/signup`, formData);
//       navigate("/login");
//     } catch (err) {
//       setServerError(err.response?.data?.message || "Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
//         <motion.div className="pro-login-card p-5 rounded-4 shadow-sm">
//           <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>

//           <form onSubmit={handleSubmit}>
//             {/* First Name */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">First Name</label>
//               <input
//                 type="text"
//                 name="fname"
//                 className="form-control pro-input"
//                 value={formData.fname}
//                 onChange={handleChange}
//               />
//               {errors.fname && <small className="text-danger">{errors.fname}</small>}
//             </div>

//             {/* Last Name */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Last Name</label>
//               <input
//                 type="text"
//                 name="lname"
//                 className="form-control pro-input"
//                 value={formData.lname}
//                 onChange={handleChange}
//               />
//               {errors.lname && <small className="text-danger">{errors.lname}</small>}
//             </div>

//             {/* Mobile */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Mobile Number</label>
//               <input
//                 type="text"
//                 name="mobile"
//                 className="form-control pro-input"
//                 value={formData.mobile}
//                 onChange={handleChange}
//               />
//               {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
//             </div>

//             {/* Email + OTP */}
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Email</label>
//               <div className="d-flex gap-2">
//                 <input
//                   type="email"
//                   name="email"
//                   className="form-control pro-input"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={otpVerified}
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-outline-primary"
//                   onClick={otpSent ? handleVerifyOtp : handleSendOtp}
//                   disabled={otpLoading || otpVerified}
//                 >
//                   {otpSent ? "Verify OTP" : "Send OTP"}
//                 </button>
//               </div>

//               {otpSent && !otpVerified && (
//                 <input
//                   type="text"
//                   className="form-control pro-input mt-2"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                 />
//               )}

//               {otpVerified && (
//                 <small className="text-success d-block">Email verified ✅</small>
//               )}
//               {errors.otp && <small className="text-danger">{errors.otp}</small>}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="form-label fw-semibold">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control pro-input"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {errors.password && <small className="text-danger">{errors.password}</small>}
//             </div>

//             {serverError && <p className="text-danger text-center">{serverError}</p>}

//             <motion.button
//               className="btn w-100 py-2 pro-btn"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </motion.button>

//             {/* OR separator */}
//             <div className="my-4 d-flex align-items-center">
//               <hr className="flex-grow-1" />
//               <span className="mx-2 text-muted small">OR</span>
//               <hr className="flex-grow-1" />
//             </div>

//             {/* Google Sign-In */}
//             <div id="google-btn"></div>

//             <p className="text-center mt-3 small">
//               Already have an account?
//               <NavLink to="/login" className="pro-link ms-1">Login</NavLink>
//             </p>
//           </form>
//         </motion.div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Signup;



import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./signup.css";

const api_base = process.env.REACT_APP_API_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // =========================
  // GOOGLE LOGIN INIT
  // =========================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(`${api_base}/googlelogin`, {
        token: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/"); // redirect after login
    } catch (error) {
      console.error("Google login failed", error.response?.data || error);
      setServerError(error.response?.data?.message || "Google login failed");
    }
  };

  // =========================
  // FORM HANDLERS
  // =========================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!formData.fname) err.fname = "First name is required";
    if (!formData.lname) err.lname = "Last name is required";
    if (!formData.email) err.email = "Email is required";
    if (!formData.mobile) err.mobile = "Mobile number is required";
    if (!formData.password) err.password = "Password is required";
    if (!otpVerified) err.otp = "Email must be verified via OTP";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // =========================
  // OTP EMAIL
  // =========================
  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors({ email: "Enter email first" });
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${api_base}/send-otp`, {
        email: formData.email,
      });
      if (res.data.success) {
        setOtpSent(true);
        setErrors({});
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to send OTP");
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
      const res = await axios.post(`${api_base}/verify-otp`, {
        email: formData.email,
        otp,
      });
      if (res.data.success) {
        setOtpVerified(true);
        setErrors({});
      }
    } catch (err) {
      setErrors({ otp: "Invalid or expired OTP" });
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================
  // SIGNUP SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      await axios.post(`${api_base}/signup`, formData);
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="pro-login-wrapper d-flex align-items-center justify-content-center">
        <motion.div className="pro-login-card p-5 rounded-4 shadow-sm">
          <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold"></label>
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                className="form-control pro-input"
                value={formData.fname}
                onChange={handleChange}
              />
              {errors.fname && <small className="text-danger">{errors.fname}</small>}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold"></label>
              <input
                type="text"
                name="lname"
                className="form-control pro-input"
                placeholder="Last Name"
                value={formData.lname}
                onChange={handleChange}
              />
              {errors.lname && <small className="text-danger">{errors.lname}</small>}
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label fw-semibold"></label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                className="form-control pro-input"
                value={formData.mobile}
                onChange={handleChange}
              />
              {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
            </div>

            {/* Email + OTP */}
            <div className="mb-3">
              <label className="form-label fw-semibold"></label>
              <div className="d-flex gap-2">
                <input
                  type="email"
                  name="email"
                  className="form-control pro-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  disabled={otpLoading || otpVerified}
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </div>

              {otpSent && !otpVerified && (
                <input
                  type="text"
                  className="form-control pro-input mt-2"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              {otpVerified && (
                <small className="text-success d-block">Email verified ✅</small>
              )}
              {errors.otp && <small className="text-danger">{errors.otp}</small>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold"></label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control pro-input"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            {serverError && <p className="text-danger text-center">{serverError}</p>}

            <motion.button
              className="btn w-100 py-2 btn-outline-dark"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>

            {/* OR separator */}
            <div className="my-4 d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted small">OR</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Google Sign-In */}
            {/* <div id="google-btn" className="d-flex justify-content-center"></div> */}
            <div id="google-btn">
              <div className="mb-4">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="mx-2 text-muted small">OR</span>
                    <hr className="flex-grow-1" />
                  </div>

                  {/* Google */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn social-btn google-btn w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <img
                      src="/images/google.png"
                      alt="Google"
                      width="18"
                    />
                    Continue with Google
                  </motion.button>
                </div>
              </div>
            </div>
            <p className="text-center mt-3 small">
              Already have an account?
              <NavLink to="/login" className="pro-link ms-1 text-dark">Login</NavLink>
            </p>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;



