const express = require("express");
const authenticate = require("../middleware/authenticate");
const Order = require("../Model/order");
const router = express.Router();

// PLACE ORDER
router.post("/place", authenticate, async (req, res) => {
  const order = await Order.create({
    userId: req.user.id,
    ...req.body,
    orderStatus: "Pending",
  });

  res.json({ message: "Order placed", orderId: order._id });
});

// ORDER STATUS
router.get("/status/:orderId", authenticate, async (req, res) => {
  const order = await Order.findOne({ customOrderId: req.params.orderId });
  res.json(order);
});

module.exports = router;
