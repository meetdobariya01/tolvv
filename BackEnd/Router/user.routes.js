const express = require("express");
const Product = require("../Model/Product.add.admin");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Product.find());
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const result = category === "All" ? await Product.find() : await Product.find({ Category: category });
  res.json(result);
});

// Zodiac products
router.get("/zodiac/:zodiac", async (req, res) => {
  const { zodiac } = req.params;
  res.json(await Product.find({ Zodiac: zodiac }));
});

module.exports = router;

