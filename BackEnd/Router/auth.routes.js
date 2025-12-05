const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/UserSchema");
const router = express.Router();

// Twilio Client
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

// OTP Expiry Time (5 minutes)
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

const tempOtp = global.tempOtp || {};

// SIGNUP
router.post("/signup", async (req, res) => {
  const { fname, lname, password, mobile, role } = req.body;

  if (!tempOtp[mobile] || !tempOtp[mobile].verified)
    return res.status(400).json({ message: "Mobile not verified" });

  const exists = await User.findOne({ mobile });
  if (exists) return res.status(400).json({ message: "Mobile already registered" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ fname, lname, password: hashed, mobile, role: role || "user" });

  delete tempOtp[mobile];

  res.json({ message: "User registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ message: "Login successful", token, role: user.role });
});

// FORGOT PASSWORD – SEND OTP
router.post("/forgot-password", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: "Mobile number is required." });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    tempOtp[mobile] = { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME };

    console.log(`Sending OTP to +91${mobile}: ${otp}`);

    try {
      await client.messages.create({
        body: `Your password reset OTP is ${otp}`,
        to: `+91${mobile}`,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (err) {
      console.warn(`Twilio error: ${err.message}`);
    }

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// VERIFY RESET OTP
router.post("/verify-reset-otp", async (req, res) => {
  const { mobile, Otp } = req.body;
  const record = tempOtp[mobile];
  if (!record) return res.status(400).json({ message: "OTP not found or expired." });

  if (record.otp !== Otp) return res.status(400).json({ message: "Invalid OTP." });
  if (Date.now() > record.expiresAt) {
    delete tempOtp[mobile];
    return res.status(400).json({ message: "OTP expired." });
  }

  tempOtp[mobile].verified = true;
  res.status(200).json({ message: "OTP verified successfully." });
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { mobile, newPassword } = req.body;
  if (!mobile || !newPassword)
    return res.status(400).json({ message: "Mobile and new password are required." });

  const record = tempOtp[mobile];
  if (!record || !record.verified)
    return res.status(400).json({ message: "OTP not verified." });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    delete tempOtp[mobile];
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
