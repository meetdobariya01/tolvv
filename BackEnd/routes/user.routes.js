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
router.get("/address", authenticate, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.addresses);

  } catch (err) {
    console.error("Address fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ADD NEW ADDRESS
router.post("/address", authenticate, async (req, res) => {
  try {

    const {
      houseNumber,
      buildingName,
      societyName,
      road,
      landmark,
      city,
      State,
      pincode,
      mobile,
      isDefault
    } = req.body;

    if (!city || !pincode) {
      return res.status(400).json({
        message: "City and Pincode are required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      houseNumber,
      buildingName,
      societyName,
      road,
      landmark,
      city,
      State: city, // Assuming State is same as City for simplicity
      pincode,
      mobile,
      isDefault
    };

    user.addresses.push(newAddress);

    await user.save();

    res.json({
      message: "Address added successfully",
      addresses: user.addresses
    });

  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;