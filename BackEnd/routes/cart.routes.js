const express = require("express");
const router = express.Router();
const Cart = require("../Model/Cart");
const Product = require("../Model/Product.add.admin");
const { authenticate } = require("../middleware/auth.middleware");
const Hamper = require("../Model/Hamper");

// Get cart
router.get("/", authenticate, async (req, res) => {

  try {

    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId")
      .populate({
        path: "items.hamperId",
        populate: {
          path: "products.productId"
        }
      });

    if (!cart) {
      return res.status(200).json({
        cart: [],
        totalPrice: 0
      });
    }

    let totalPrice = 0;

    cart.items.forEach(item => {

      if (item.productId) {
        totalPrice += item.quantity * item.productId.ProductPrice;
      }

      if (item.hamperId) {
        totalPrice += item.quantity * item.hamperId.totalPrice;
      }

    });

    res.status(200).json({
      cart,
      totalPrice
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// Add to cart
router.post("/add", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ 
        userId: req.user.id, 
        items: [{ productId, quantity: quantity || 1 }] 
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity: quantity || 1 });
      }
    }
    
    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put("/update/:productId", authenticate, async (req, res) => {
  const { quantity } = req.body;
  
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === req.params.productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete("/remove/:productId", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete("/clear", authenticate, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } }
    );
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Merge guest cart with user cart
router.post("/merge", authenticate, async (req, res) => {
  try {
    const { guestItems } = req.body;

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return res.status(400).json({ message: "No items to merge" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    guestItems.forEach((item) => {
      if (!item.productId || !item.quantity) return;

      const existingItem = cart.items.find(
        (ci) => ci.productId.toString() === item.productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += Number(item.quantity);
      } else {
        cart.items.push({
          productId: item.productId,
          quantity: Number(item.quantity),
        });
      }
    });

    await cart.save();
    res.status(200).json({ message: "Cart merged successfully", cart });
  } catch (error) {
    console.error("MERGE ERROR:", error);
    res.status(500).json({ message: "Merge failed" });
  }
});

router.post("/add-hamper", authenticate, async (req, res) => {
  try {
    const { hamperId, quantity = 1 } = req.body;

    const hamper = await Hamper.findById(hamperId);
    if (!hamper) {
      return res.status(404).json({ message: "Hamper not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ hamperId, quantity }]
      });
    } else {
      const index = cart.items.findIndex(
        item => item.hamperId?.toString() === hamperId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ hamperId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Hamper added to cart successfully",
      cart
    });

  } catch (error) {
    console.error("Add hamper error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;