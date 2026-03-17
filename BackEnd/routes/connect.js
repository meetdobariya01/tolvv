const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/email.service");

// POST /api/connect
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ SEND EMAIL (ADMIN + USER)
    await sendContactEmail(name, email, phone, subject, message);

    res.status(200).json({
      message: "Message sent successfully",
    });

  } catch (err) {
    console.error("Connect error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;