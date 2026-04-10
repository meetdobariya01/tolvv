/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const User = require("../Model/UserSchema");
const Order = require("../Model/order");
const Product = require("../Model/Product.add.admin");
const { authenticate } = require("../middleware/auth.middleware");

// Get user dashboard
router.get("/dashboard", authenticate, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: "Access denied: Users only" });
  }

  try {
    const availableProducts = await Product.find();
    const userOrders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    const orderDetails = userOrders.map(order => ({
      orderId: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      deliveryAddress: order.address,
      placedAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.productId ? item.productId.ProductName : 'Product Not Found',
        quantity: item.quantity,
        pricePerItem: item.productId ? item.productId.ProductPrice : 0
      }))
    }));

    res.status(200).json({
      message: "Welcome to User Dashboard",
      availableProducts,
      orders: orderDetails
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { fname, lname, mobile } = req.body;
    const updates = {};

    if (fname) updates.fname = fname;
    if (lname) updates.lname = lname;
    if (mobile) updates.mobile = mobile;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/profile", authenticate, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/profile", authenticate, async (req, res) => {
  try {

    const { fname, lname, mobile, dob, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fname, lname, mobile, dob, gender },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER ADDRESSES
// ================= ADDRESS MANAGEMENT ROUTES =================

// GET USER ADDRESSES - Fix for your schema
router.get("/addresses", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Your schema uses "addresses" not "savedAddresses"
    res.json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new address - Fix for your schema
router.post("/addresses", authenticate, async (req, res) => {
  try {
    const { houseNumber, buildingName, societyName, road, landmark, city, pincode, State, mobile, isDefault } = req.body;
    
    if (!houseNumber || !city || !pincode || !mobile) {
      return res.status(400).json({ message: "House number, city, pincode and mobile are required" });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this is first address or isDefault true, set as default
    if (user.addresses.length === 0 || isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses.push({
      houseNumber,
      buildingName,
      societyName,
      road,
      landmark,
      city,
      email: user.email, // Use user's email from DB
      pincode,
      State,
      mobile,
      isDefault: isDefault || user.addresses.length === 0
    });
    
    await user.save();
    
    res.json({ 
      success: true,
      message: "Address saved successfully",
      address: user.addresses[user.addresses.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an address
router.delete("/addresses/:addressId", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.addresses) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    
    await user.save();
    
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;