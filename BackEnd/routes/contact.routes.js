const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/email.service");

// Contact form submission
router.post("/connect", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await sendContactEmail(name, email, phone, subject, message);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Connect mail error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;