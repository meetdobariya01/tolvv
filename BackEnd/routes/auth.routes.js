const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const User = require("../Model/UserSchema");
const otpStorage = require("../utils/otp.storage");
const { sendOTPEmail, sendPasswordResetOTP } = require("../utils/email.service");
const { authenticate } = require("../middleware/auth.middleware");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStorage.storeOTP(email, otp);
    await sendOTPEmail(email, otp);
    
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const result = otpStorage.verifyOTP(email, otp);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

// Signup
router.post("/signup", async (req, res) => {
  const { fname, lname, email, password, mobile, role } = req.body;

  if (!fname || !lname || !email || !password || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fname,
      lname,
      email,
      mobile,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.googleAuth) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Google Login
router.post("/googlelogin", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    const { email, given_name, family_name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fname: given_name || "Google",
        lname: family_name || "User",
        email,
        googleAuth: true,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ success: false, message: "Google login failed" });
  }
});

// Forgot password - send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.storeResetOTP(email, otp);
    await sendPasswordResetOTP(email, otp);

    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify reset OTP
router.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;
  const result = otpStorage.verifyResetOTP(email, otp);
  
  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }
  
  res.status(200).json({ message: "OTP verified successfully" });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const record = otpStorage.tempEmailOtp[email];
  if (!record || !record.verified) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    otpStorage.clearResetOTP(email);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;