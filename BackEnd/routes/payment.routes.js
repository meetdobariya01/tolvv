const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const User = require("../Model/UserSchema"); // ✅ FIXED
const { PaymentHandler, validateHMAC_SHA256 } = require("../payment/PaymentHandler");
const { authenticate } = require("../middleware/auth.middleware");

const {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} = require("../utils/email.service");


// ================= INITIATE PAYMENT =================
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
      return_url:
        process.env.PAYMENT_CALLBACK_URL ||
        "http://localhost:4000/api/payment/callback",
    });

    if (sessionResp?.payment_links?.web) {
      return res.json({
        redirect: sessionResp.payment_links.web,
      });
    }

    return res.status(500).json({ message: "Payment session creation failed" });

  } catch (err) {
    console.error("Payment initiation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= WEBHOOK =================
router.post("/webhook", express.json(), async (req, res) => {
  try {
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

    const { order_id, payment_status, amount_paid, transaction_id } = req.body;

    if (!order_id || !payment_status || !amount_paid || !transaction_id) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const order = await Order.findOne({ customOrderId: order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ amount check
    if (Math.round(amount_paid) !== Math.round(order.totalAmount)) {
      order.status = "AMOUNT_MISMATCH";
      await order.save();
      return res.status(400).json({ message: "Amount mismatch" });
    }

    // ================= SUCCESS =================
    if (payment_status === "SUCCESS") {
      order.status = "PAID";
      order.orderStatus = "Confirmed";
      order.paymentId = transaction_id;
      order.paidAt = new Date();

      // ✅ PREVENT DUPLICATE EMAIL
      if (!order.emailSent) {
        order.emailSent = true; // 🔒 LOCK FIRST
        await order.save();

        const user = await User.findById(order.userId);

        const itemsHtml = order.items.map(i => {
          if (!i.hamperItems) {
            return `<li>${i.productName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`;
          }

          const hamperList = i.hamperItems.map(h => `
            <li style="margin-left:15px;">
              - ${h.name} × ${h.quantity} ${h.isFree ? "(FREE)" : ""}
            </li>
          `).join("");

          return `
            <li>
              <strong>${i.productName}</strong> — ₹${i.priceAtBuy} × ${i.quantity}
              <ul>${hamperList}</ul>
            </li>
          `;
        }).join("");

        const orderDetails = {
          customOrderId: order.customOrderId,
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          itemsHtml,
          phone: order.address.mobile,
        };

        await sendOrderConfirmationEmail(user.email, orderDetails);
        await sendAdminOrderNotification(orderDetails, user, order.address, order.note);
      }

    } else {
      order.status = "PAYMENT_FAILED";
    }

    await order.save();

    console.log("✅ Webhook processed:", order_id);

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});


// ================= CALLBACK =================
router.post("/callback", async (req, res) => {
  const paymentHandler = PaymentHandler.getInstance();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    if (!validateHMAC_SHA256(req.body, paymentHandler.getResponseKey())) {
      return res.redirect(`${frontendUrl}/payment-failed`);
    }

    const { order_id } = req.body;

    const orderStatusResp = await paymentHandler.orderStatus(order_id);

    const order = await Order.findOne({ customOrderId: order_id });

    if (!order) {
      return res.redirect(`${frontendUrl}/payment-failed`);
    }

    if (orderStatusResp.status === "CHARGED") {
      order.status = "PAID";
      order.orderStatus = "Confirmed";

      // ✅ BACKUP EMAIL (only if webhook missed)
      if (!order.emailSent) {
        order.emailSent = true; // 🔒 LOCK FIRST
        await order.save();

        const user = await User.findById(order.userId);

        const itemsHtml = order.items.map(i => {
          if (!i.hamperItems) {
            return `<li>${i.productName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`;
          }

          const hamperList = i.hamperItems.map(h => `
            <li style="margin-left:15px;">
              - ${h.name} × ${h.quantity} ${h.isFree ? "(FREE)" : ""}
            </li>
          `).join("");

          return `
            <li>
              <strong>${i.productName}</strong> — ₹${i.priceAtBuy} × ${i.quantity}
              <ul>${hamperList}</ul>
            </li>
          `;
        }).join("");

        const orderDetails = {
          customOrderId: order.customOrderId,
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          itemsHtml,
          phone: order.address.mobile,
        };

        await sendOrderConfirmationEmail(user.email, orderDetails);
        await sendAdminOrderNotification(orderDetails, user, order.address, order.note);
      }

      await order.save();

      return res.redirect(`${frontendUrl}/payment`);
    }

    order.status = "FAILED";
    await order.save();

    return res.redirect(`${frontendUrl}/payment-failed/${order_id}`);

  } catch (err) {
    console.error("Payment callback error:", err);
    return res.redirect(`${frontendUrl}/payment-failed`);
  }
});


module.exports = router;