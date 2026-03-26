const express = require("express");
const router = express.Router();
const Hamper = require("../Model/Hamper");
const Product = require("../Model/Product.add.admin");
const {sendcouponcodeEmail
} = require("../utils/email.service");
// GET PRODUCTS BY MULTIPLE ZODIAC
router.post("/zodiac-products", async (req, res) => {
  try {
    const { zodiacs, category } = req.body;

    if (!zodiacs || zodiacs.length === 0) {
      return res.status(400).json({ message: "Zodiacs required" });
    }

    let query = {
      Zodiac: { $in: zodiacs }
    };

    // Apply category filter if it's not "All"
    if (category && category !== "All") {
      query.Category = category; 
    }

    console.log("QUERY:", query);
    const products = await Product.find(query);
    console.log("FOUND:", products.length);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE HAMPER
router.post("/create", async (req, res) => {
  try {
    const { zodiacs, products } = req.body;
    let totalPrice = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      totalPrice += product.ProductPrice * item.quantity;
    }

    if (totalPrice < 2500) {
      return res.status(400).json({
        message: "Minimum hamper value must be ₹2500"
      });
    }

    const hamper = new Hamper({
      zodiacs,
      products,
      totalPrice
    });

    await hamper.save();
    res.status(201).json({
      message: "Hamper created successfully",
      hamper
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/coupon/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const couponCode = "WELCOME10"; // or generate dynamically

    await sendcouponcodeEmail(email, couponCode);

    res.json({
      success: true,
      message: "Coupon sent successfully"
    });

  } catch (err) {
    console.error("Coupon error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;