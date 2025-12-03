// middleware/isDelivery.js
const User = require("../Model/UserSchema");

const isDelivery = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "delivery") return res.status(403).json({ message: "Access denied: Delivery personnel only" });

    next();
  } catch (error) {
    console.error("isDelivery error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isDelivery;
