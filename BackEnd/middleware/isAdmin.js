// middleware/isAdmin.js
const User = require("../Model/UserSchema");

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Access denied: Admin only" });

    next();
  } catch (error) {
    console.error("isAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdmin;
