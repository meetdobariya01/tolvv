const express = require("express");
const authenticate = require("../middleware/authenticate");
const Cart = require("../Model/Cart");
const router = express.Router();

// ADD TO CART
router.post("/add", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json({ message: "Added to cart", cart });
});

module.exports = router;
