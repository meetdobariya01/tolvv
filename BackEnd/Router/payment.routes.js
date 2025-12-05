const express = require("express");
const router = express.Router();
const { PaymentHandler, validateHMAC_SHA256 } = require("../payment/PaymentHandler");
const Order = require("../Model/order");

router.post("/callback", async (req, res) => {
  const { order_id } = req.body;
  const handler = PaymentHandler.getInstance();

  if (!validateHMAC_SHA256(req.body, handler.getResponseKey()))
    return res.status(400).send("Invalid signature");

  const status = await handler.orderStatus(order_id);

  await Order.findOneAndUpdate({ customOrderId: order_id }, { status: status.status });

  res.send(`<h1>Payment ${status.status}</h1>`);
});

module.exports = router;
