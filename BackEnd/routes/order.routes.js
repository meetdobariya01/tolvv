const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const Product = require("../Model/Product.add.admin");
const Cart = require("../Model/Cart");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");
const { 
  sendOrderConfirmationEmail, 
  sendAdminOrderNotification 
} = require("../utils/email.service");

// Place order
router.post("/place", authenticate, async (req, res) => {
  try {
    const { items, paymentMethod, address, note, customerName, customerEmail } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!address || !address.city || !address.pincode)
      return res.status(400).json({ message: "Address incomplete" });
    if (!address?.mobile)
      return res.status(400).json({ message: "Phone number required" });

    let subtotal = 0;
    const orderItems = [];

    // Price validation
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      subtotal += product.ProductPrice * item.quantity;
      orderItems.push({
        productId: product._id,
        productName: product.ProductName,
        quantity: item.quantity,
        priceAtBuy: product.ProductPrice
      });
    }

    const totalAmount = Math.round(subtotal);
    const customOrderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Create order
  const newOrder = new Order({
  userId: req.user.id,
  customOrderId,

  customerName,
  customerEmail,

  items: orderItems,
  subtotal: totalAmount,
  totalAmount,
  paymentMethod,

  status: paymentMethod === "cod" ? "COD_CONFIRMED" : "PAYMENT_PENDING",

  address,
  note: note || ""
});

    await newOrder.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } }
    );

    // Send emails
    const user = await User.findById(req.user.id);
    const products = await Product.find({
      _id: { $in: orderItems.map(i => i.productId) }
    });

    const itemsHtml = orderItems.map(i => {
      const product = products.find(p => p._id.toString() === i.productId.toString());
      return `<li>${product.ProductName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`;
    }).join("");

    const orderDetails = { customOrderId, paymentMethod, totalAmount, itemsHtml };

    // Send emails (don't await to not block response)
    sendOrderConfirmationEmail(user.email, orderDetails).catch(err => 
      console.error("User mail error:", err)
    );
    
    sendAdminOrderNotification(orderDetails, user, address, note).catch(err => 
      console.error("Admin mail error:", err)
    );

    // Handle payment redirection for online payments
    if (paymentMethod === "card" || paymentMethod === "upi") {
      // This will be handled in payment routes
      return res.status(201).json({
        message: "Order placed, proceed to payment",
        orderId: customOrderId,
        requiresPayment: true
      });
    }

    // COD response
    res.status(201).json({
      message: "Order placed successfully",
      orderId: customOrderId
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order status
router.get("/status/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      customOrderId: req.params.orderId,
      userId: req.user.id 
    }).populate("items.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      orderId: order.customOrderId,
      paymentStatus: order.status,
      deliveryStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.productId.ProductName,
        quantity: item.quantity,
        price: item.priceAtBuy
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user orders
router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Cancel Order
router.put("/cancel/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent cancelling paid orders
    if (order.status === "CHARGED") {
      return res.status(400).json({
        message: "Paid orders cannot be cancelled"
      });
    }

    // Prevent double cancel
    if (order.status === "CANCELLED") {
      return res.status(400).json({
        message: "Order already cancelled"
      });
    }

    order.status = "CANCELLED";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      orderId: order.customOrderId
    });

  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;