const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const tempOtp = {};
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  tempOtp[mobile] = { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME };

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: `+91${mobile}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP failed", error: err.message });
  }
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (!tempOtp[mobile]) return res.status(400).json({ success: false, message: "OTP not found" });
  if (tempOtp[mobile].expiresAt < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });
  if (tempOtp[mobile].otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

  tempOtp[mobile].verified = true;

  res.json({ success: true, message: "OTP verified" });
});

module.exports = router;
