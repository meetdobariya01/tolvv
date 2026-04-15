const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// DIRECT LOGIN - Email/Password (Auto-create if not exists)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    let user = await User.findOne({ email });

    // If user doesn't exist, create new account
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = new User({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        fname: email.split('@')[0], // Use part before @ as first name
        lname: "",
        role: "user"
      });

      await user.save();
      console.log(`✅ New account created for: ${email}`);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
});

// DIRECT GOOGLE LOGIN (Auto-create if not exists)
router.post("/googlelogin", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Google token is required" 
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid Google token" 
      });
    }

    const { email, given_name, family_name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user with Google data
      user = new User({
        email: email.toLowerCase(),
        fname: given_name || email.split('@')[0],
        lname: family_name || "",
        password: "google_" + Math.random().toString(36) + Date.now(),
        googleAuth: true,
        role: "user"
      });
      
      await user.save();
      console.log(`✅ New Google account created for: ${email}`);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ 
      success: true, 
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Google login failed. Please try again." 
    });
  }
});

// Get user profile (Protected route)
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;