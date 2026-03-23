const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const { PaymentHandler, validateHMAC_SHA256 } = require("../payment/PaymentHandler");
const { authenticate } = require("../middleware/auth.middleware");

// Initialize payment for an order
router.post("/initiate/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      customOrderId: req.params.orderId,
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentHandler = PaymentHandler.getInstance();
    const sessionResp = await paymentHandler.orderSession({
      order_id: order.customOrderId,
      amount: order.totalAmount,
      currency: "INR",
      customer_id: req.user.id.toString(),
      customer_mobile: req.user.mobile,
      return_url: process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/api/payment/callback"
    });

    if (sessionResp?.payment_links?.web) {
      return res.json({
        redirect: sessionResp.payment_links.web
      });
    }

    return res.status(500).json({ message: "Payment session creation failed" });
  } catch (err) {
    console.error("Payment initiation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Payment webhook (from payment gateway)
router.post("/webhook", express.json(), async (req, res) => {
  try {
    // Basic auth security
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString("utf-8")
      .split(":");

    const [username, password] = decoded;

    if (
      username !== process.env.HDFC_WEBHOOK_USERNAME ||
      password !== process.env.HDFC_WEBHOOK_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Webhook payload
    const { order_id, payment_status, amount_paid, transaction_id } = req.body;

    if (!order_id || !payment_status || !amount_paid || !transaction_id) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Find order
    const order = await Order.findOne({ customOrderId: order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Amount verification
    if (Math.round(amount_paid) !== Math.round(order.totalAmount)) {
      order.status = "AMOUNT_MISMATCH";
      await order.save();
      return res.status(400).json({ message: "Amount mismatch" });
    }

    // Update payment status
    if (payment_status === "SUCCESS") {
      order.status = "PAID";
      order.orderStatus = "Confirmed";
      order.paymentId = transaction_id;
      order.paidAt = new Date();
    } else {
      order.status = "PAYMENT_FAILED";
    }

    await order.save();
    console.log("✅ Webhook processed for:", order_id);
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

// Payment callback (redirect after payment)
router.post("/callback", async (req, res) => {
  const paymentHandler = PaymentHandler.getInstance();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    // Signature validation
    if (!validateHMAC_SHA256(req.body, paymentHandler.getResponseKey())) {
      return res.redirect(`${frontendUrl}/payment-failed`);
    }

    const { order_id } = req.body;
    const orderStatusResp = await paymentHandler.orderStatus(order_id);

    // Update order
    await Order.findOneAndUpdate(
      { customOrderId: order_id },
      {
        status: orderStatusResp.status === "CHARGED" ? "PAID" : "FAILED",
        orderStatus: orderStatusResp.status === "CHARGED" ? "Confirmed" : "Payment Failed"
      }
    );

    // Redirect based on status
    if (orderStatusResp.status === "CHARGED") {
      return res.redirect(`${frontendUrl}/payment`);
    }

    return res.redirect(`${frontendUrl}/payment-failed/${order_id}`);
  } catch (err) {
    console.error("Payment callback error:", err);
    return res.redirect(`${frontendUrl}/payment-failed`);
  }
});

module.exports = router;