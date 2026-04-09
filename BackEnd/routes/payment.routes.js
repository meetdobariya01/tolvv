
const express = require("express");
const router = express.Router();
const Order = require("../Model/order");
const User = require("../Model/UserSchema");
const { PaymentHandler, validateHMAC_SHA256 } = require("../payment/PaymentHandler");
const { authenticate } = require("../middleware/auth.middleware");

const {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} = require("../utils/email.service");

const ShipRocketService = require("../services/shiprocket.service");

// Helper function to format phone number
function formatPhoneNumber(phone) {
  if (!phone) return "9999999999";
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) cleaned = cleaned.substring(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length > 10) return cleaned.slice(-10);
  return cleaned.padStart(10, '0');
}

// Helper function to create ShipRocket shipment
async function createShipRocketShipment(order) {
  try {
    const shiprocket = ShipRocketService.getInstance();
    const formattedPhone = formatPhoneNumber(order.address.mobile);
    
    const addressParts = [
      order.address.houseNumber,
      order.address.buildingName,
      order.address.societyName,
      order.address.road
    ].filter(Boolean);
    
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : order.address.street || "Address not provided";
    
    const orderItems = order.items.map(item => ({
      name: item.productName.substring(0, 100),
      sku: item.productId?.toString() || item.hamperId?.toString() || "CUSTOM",
      units: item.quantity,
      selling_price: Math.round(item.priceAtBuy),
      discount: 0,
      tax: 0,
      hsn: 0
    }));
    
    let shiprocketPaymentMethod = "Prepaid";
    if (order.paymentMethod === "cod") {
      shiprocketPaymentMethod = "COD";
    } else if (order.paymentMethod === "cod_hybrid") {
      shiprocketPaymentMethod = "COD";
    }
    
    const shiprocketOrderData = {
      order_id: order.customOrderId,
      order_date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "home",
      billing_customer_name: order.customerName || "Customer",
      billing_last_name: "",
      billing_address: fullAddress,
      billing_address_2: order.address.landmark || "",
      billing_city: order.address.city || "Ahmedabad",
      billing_pincode: order.address.pincode || "380015",
      billing_state: order.address.state || "Gujarat",
      billing_country: "India",
      billing_email: order.customerEmail,
      billing_phone: formattedPhone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: shiprocketPaymentMethod,
      shipping_charges: order.shippingCost || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: Math.round(order.subtotal || order.totalAmount),
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.totalWeight || 1.0
    };

    console.log("Creating ShipRocket order for:", order.customOrderId);
    const response = await shiprocket.createOrder(shiprocketOrderData);
    
    if (response && response.status === 200) {
      order.shiprocketOrderId = response.data.order_id;
      order.shiprocketShipmentId = response.data.shipment_id;
      order.orderStatus = "Processing for Shipping";
      await order.save();
      console.log(`✅ ShipRocket order created for ${order.customOrderId}`);
      return true;
    }
    throw new Error("ShipRocket order creation failed");
  } catch (error) {
    console.error(`❌ ShipRocket failed for ${order.customOrderId}:`, error.response?.data || error.message);
    return false;
  }
}

// Helper function to send emails
async function sendOrderEmails(order, user, isHybridCOD = false) {
  try {
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

    let paymentDescription = order.paymentMethod;
    if (isHybridCOD && order.partialPayment) {
      paymentDescription = `Hybrid COD - ₹${order.partialPayment.paidOnline} paid online, remaining ₹${order.partialPayment.remainingToPay} to be paid on delivery`;
    } else if (order.paymentMethod === "cod") {
      paymentDescription = "Cash on Delivery";
    }

    const orderDetails = {
      customOrderId: order.customOrderId,
      paymentMethod: paymentDescription,
      totalAmount: order.totalAmount,
      itemsHtml,
      phone: order.address.mobile,
    };

    if (isHybridCOD && order.partialPayment) {
      orderDetails.partialPaid = order.partialPayment.paidOnline;
      orderDetails.remainingAmount = order.partialPayment.remainingToPay;
    }

    await sendOrderConfirmationEmail(user.email, orderDetails);
    await sendAdminOrderNotification(orderDetails, user, order.address, order.note);
    console.log(`✅ Emails sent for ${order.customOrderId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed for ${order.customOrderId}:`, error);
    return false;
  }
}

// ================= INITIATE HYBRID COD PAYMENT =================
router.post("/initiate-hybrid-cod/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod !== "cod_hybrid") {
      return res.status(400).json({ message: "Order is not set for hybrid COD" });
    }

    if (order.status === "PARTIALLY_PAID_COD") {
      return res.status(400).json({ message: "Partial payment already made for this order" });
    }

    if (order.status !== "PAYMENT_PENDING") {
      return res.status(400).json({ message: "Order cannot be processed" });
    }

    const paymentHandler = PaymentHandler.getInstance();

    // Use the base URL from env
    const baseUrl = process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/api/payment";

    const sessionResp = await paymentHandler.orderSession({
      order_id: `${order.customOrderId}_HYBRID`,
      amount: 200,
      currency: "INR",
      customer_id: req.user.id.toString(),
      customer_mobile: req.user.mobile,
      return_url: `${baseUrl}/hybrid-cod-callback`,
    });

    if (sessionResp?.payment_links?.web) {
      return res.json({
        redirect: sessionResp.payment_links.web,
        message: "Please pay ₹200 online to confirm your COD order"
      });
    }

    return res.status(500).json({ message: "Payment session creation failed" });

  } catch (err) {
    console.error("Hybrid COD initiation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= HYBRID COD PAYMENT CALLBACK =================
router.post("/hybrid-cod-callback", async (req, res) => {
  const paymentHandler = PaymentHandler.getInstance();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    console.log("=== HYBRID COD CALLBACK RECEIVED ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Get the order_id from the callback
    let orderIdFromCallback = req.body.order_id || req.body.orderId || req.body.orderid;
    
    if (!orderIdFromCallback) {
      console.error("No order_id found in callback");
      return res.redirect(`${frontendUrl}/payment-failed?error=no_order_id`);
    }

    console.log(`Order ID from callback: ${orderIdFromCallback}`);

    // Check if this is a hybrid COD order
    const isHybridCOD = orderIdFromCallback.endsWith('_HYBRID');
    const originalOrderId = isHybridCOD ? orderIdFromCallback.replace('_HYBRID', '') : orderIdFromCallback;

    console.log(`Processing order: ${originalOrderId}, isHybrid: ${isHybridCOD}`);

    // Get order status from payment gateway API
    let orderStatusResp;
    try {
      orderStatusResp = await paymentHandler.orderStatus(orderIdFromCallback);
      console.log("Order status response:", JSON.stringify(orderStatusResp, null, 2));
    } catch (apiError) {
      console.error("Error fetching order status:", apiError);
      return res.redirect(`${frontendUrl}/payment-failed?error=api_error`);
    }

    // Find the order
    const order = await Order.findOne({ customOrderId: originalOrderId });

    if (!order) {
      console.error(`Order not found: ${originalOrderId}`);
      return res.redirect(`${frontendUrl}/payment-failed?error=order_not_found`);
    }

    // Check if payment was successful
    const isPaymentSuccessful = orderStatusResp.status === "CHARGED" || 
                               orderStatusResp.status === "SUCCESS" ||
                               (orderStatusResp.payment_status === "SUCCESS") ||
                               orderStatusResp.code === "PAYMENT_SUCCESS";

    if (isPaymentSuccessful) {
      console.log(`✅ Payment successful for order ${originalOrderId}`);
      
      // Update order with partial payment
      order.partialPayment = {
        paidOnline: 200,
        remainingToPay: order.totalAmount - 200,
        paymentMode: "COD_HYBRID",
        transactionId: orderStatusResp.transaction_id || orderStatusResp.order_id || orderIdFromCallback,
        paidAt: new Date()
      };
      order.status = "PARTIALLY_PAID_COD";
      order.orderStatus = "Partial Payment Received";
      order.paymentId = orderStatusResp.transaction_id || orderStatusResp.order_id;
      order.paidAt = new Date();

      await order.save();
      console.log(`Order ${originalOrderId} updated to status: ${order.status}`);

      // Send emails if not sent
      if (!order.emailSent) {
        order.emailSent = true;
        await order.save();

        const user = await User.findById(order.userId);
        if (user) {
          await sendOrderEmails(order, user, true);
        }
      }

      // Create ShipRocket shipment
      if (!order.shiprocketShipmentId) {
        setTimeout(async () => {
          await createShipRocketShipment(order);
        }, 2000);
      }

      // Redirect to success page with hybrid COD info
      return res.redirect(`${frontendUrl}/payment-success?orderId=${originalOrderId}&type=hybrid-cod&remaining=${order.totalAmount - 200}`);
    } else {
      console.error(`Payment failed for order ${originalOrderId}. Status: ${orderStatusResp.status}`);
      order.status = "COD_PAYMENT_FAILED";
      await order.save();
      return res.redirect(`${frontendUrl}/payment-failed?error=payment_failed`);
    }

  } catch (err) {
    console.error("Hybrid COD callback error:", err);
    return res.redirect(`${frontendUrl}/payment-failed?error=server_error`);
  }
});
router.post("/callback/hybrid-cod-callback", async (req, res) => {
  // Redirect or forward to the main handler
  console.log("Received callback at /callback/hybrid-cod-callback, forwarding...");
  
  // Forward to the main handler by calling it with the same req and res
  const mainHandler = async (req, res) => {
    // Copy the same code from /hybrid-cod-callback here
    const paymentHandler = PaymentHandler.getInstance();
    const frontendUrl = process.env.FRONTEND_URL;

    try {
      console.log("=== HYBRID COD CALLBACK RECEIVED (via /callback/) ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));

      let orderIdFromCallback = req.body.order_id || req.body.orderId || req.body.orderid;
      
      if (!orderIdFromCallback) {
        console.error("No order_id found in callback");
        return res.redirect(`${frontendUrl}/payment-failed`);
      }

      const isHybridCOD = orderIdFromCallback.endsWith('_HYBRID');
      const originalOrderId = isHybridCOD ? orderIdFromCallback.replace('_HYBRID', '') : orderIdFromCallback;

      console.log(`Processing order: ${originalOrderId}, isHybrid: ${isHybridCOD}`);

      let orderStatusResp;
      try {
        orderStatusResp = await paymentHandler.orderStatus(orderIdFromCallback);
        console.log("Order status response:", JSON.stringify(orderStatusResp, null, 2));
      } catch (apiError) {
        console.error("Error fetching order status:", apiError);
        return res.redirect(`${frontendUrl}/payment-failed`);
      }

      const order = await Order.findOne({ customOrderId: originalOrderId });

      if (!order) {
        console.error(`Order not found: ${originalOrderId}`);
        return res.redirect(`${frontendUrl}/payment-failed`);
      }

      const isPaymentSuccessful = orderStatusResp.status === "CHARGED" || 
                                 orderStatusResp.status === "SUCCESS" ||
                                 orderStatusResp.payment_status === "SUCCESS";

      if (isPaymentSuccessful) {
        console.log(`✅ Payment successful for order ${originalOrderId}`);
        
        order.partialPayment = {
          paidOnline: 200,
          remainingToPay: order.totalAmount - 200,
          paymentMode: "COD_HYBRID",
          transactionId: orderStatusResp.transaction_id || orderStatusResp.order_id,
          paidAt: new Date()
        };
        order.status = "PARTIALLY_PAID_COD";
        order.orderStatus = "Partial Payment Received";
        order.paymentId = orderStatusResp.transaction_id || orderStatusResp.order_id;
        order.paidAt = new Date();

        await order.save();

        if (!order.emailSent) {
          order.emailSent = true;
          await order.save();
          const user = await User.findById(order.userId);
          if (user) {
            await sendOrderEmails(order, user, true);
          }
        }

        if (!order.shiprocketShipmentId) {
          setTimeout(async () => {
            await createShipRocketShipment(order);
          }, 2000);
        }

        return res.redirect(`${frontendUrl}/payment`);
      } else {
        console.error(`Payment failed for order ${originalOrderId}`);
        order.status = "COD_PAYMENT_FAILED";
        await order.save();
        return res.redirect(`${frontendUrl}/payment-failed`);
      }

    } catch (err) {
      console.error("Hybrid COD callback error:", err);
      return res.redirect(`${frontendUrl}/payment-failed`);
    }
  };

  await mainHandler(req, res);
});
// ================= INITIATE REGULAR PAYMENT =================
router.post("/initiate/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod === "cod_hybrid") {
      return res.status(400).json({ message: "Use hybrid COD payment endpoint" });
    }

    const paymentHandler = PaymentHandler.getInstance();
    const baseUrl = process.env.PAYMENT_CALLBACK_URL;

    const sessionResp = await paymentHandler.orderSession({
      order_id: order.customOrderId,
      amount: order.totalAmount,
      currency: "INR",
      customer_id: req.user.id.toString(),
      customer_mobile: req.user.mobile,
      return_url: `${baseUrl}/callback`,
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

// ================= REGULAR PAYMENT CALLBACK =================
router.post("/callback", async (req, res) => {
  const paymentHandler = PaymentHandler.getInstance();
  const frontendUrl = process.env.FRONTEND_URL;

  try {
    console.log("=== REGULAR PAYMENT CALLBACK RECEIVED ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { order_id } = req.body;
    
    if (!order_id) {
      console.error("No order_id in callback");
      return res.redirect(`${frontendUrl}/payment-failed`);
    }

    // Get order status from API
    const orderStatusResp = await paymentHandler.orderStatus(order_id);
    console.log("Order status:", JSON.stringify(orderStatusResp, null, 2));

    const order = await Order.findOne({ customOrderId: order_id });

    if (!order) {
      console.error(`Order not found: ${order_id}`);
      return res.redirect(`${frontendUrl}/payment-failed`);
    }

    const isSuccessful = orderStatusResp.status === "CHARGED" || 
                        orderStatusResp.status === "SUCCESS" ||
                        orderStatusResp.payment_status === "SUCCESS";

    if (isSuccessful) {
      order.status = "PAID";
      order.orderStatus = "Confirmed";
      order.paymentId = orderStatusResp.transaction_id || orderStatusResp.order_id;
      order.paidAt = new Date();

      await order.save();

      if (!order.emailSent) {
        order.emailSent = true;
        await order.save();
        const user = await User.findById(order.userId);
        if (user) {
          await sendOrderEmails(order, user, false);
        }
      }

      if (!order.shiprocketShipmentId) {
        setTimeout(async () => {
          await createShipRocketShipment(order);
        }, 2000);
      }

      return res.redirect(`${frontendUrl}/payment`);
    }

    order.status = "FAILED";
    await order.save();
    return res.redirect(`${frontendUrl}/payment-failed`);

  } catch (err) {
    console.error("Payment callback error:", err);
    return res.redirect(`${frontendUrl}/payment-failed`);
  }
});

// ================= WEBHOOK FOR PAYMENT GATEWAY =================
router.post("/webhook", express.json(), async (req, res) => {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Webhook body:", JSON.stringify(req.body, null, 2));

    const { order_id, payment_status, transaction_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "No order_id in webhook" });
    }

    const isHybridCOD = order_id.endsWith('_HYBRID');
    const originalOrderId = isHybridCOD ? order_id.replace('_HYBRID', '') : order_id;

    const order = await Order.findOne({ customOrderId: originalOrderId });

    if (!order) {
      console.error(`Order not found: ${originalOrderId}`);
      return res.status(404).json({ message: "Order not found" });
    }

    const isSuccessful = payment_status === "SUCCESS" || payment_status === "CHARGED";

    if (isSuccessful) {
      if (isHybridCOD) {
        order.partialPayment = {
          paidOnline: 200,
          remainingToPay: order.totalAmount - 200,
          paymentMode: "COD_HYBRID",
          transactionId: transaction_id,
          paidAt: new Date()
        };
        order.status = "PARTIALLY_PAID_COD";
        order.orderStatus = "Partial Payment Received";
        order.paymentId = transaction_id;
        order.paidAt = new Date();
      } else {
        order.status = "PAID";
        order.orderStatus = "Confirmed";
        order.paymentId = transaction_id;
        order.paidAt = new Date();
      }

      await order.save();

      if (!order.emailSent) {
        order.emailSent = true;
        await order.save();
        const user = await User.findById(order.userId);
        if (user) {
          await sendOrderEmails(order, user, isHybridCOD);
        }
      }

      if (!order.shiprocketShipmentId) {
        setTimeout(async () => {
          await createShipRocketShipment(order);
        }, 2000);
      }
    } else {
      order.status = isHybridCOD ? "COD_PAYMENT_FAILED" : "FAILED";
      await order.save();
    }

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

// ================= ADMIN: CONFIRM HYBRID COD DELIVERY =================
router.post("/admin/confirm-hybrid-cod-delivery/:orderId", authenticate, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const order = await Order.findOne({ customOrderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod !== "cod_hybrid") {
      return res.status(400).json({ message: "Not a hybrid COD order" });
    }

    if (order.status !== "PARTIALLY_PAID_COD") {
      return res.status(400).json({ message: "Order not in partially paid state" });
    }

    order.status = "PAID";
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date();
    order.partialPayment.cashCollected = order.partialPayment.remainingToPay;
    order.partialPayment.collectedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Hybrid COD order marked as delivered",
      remainingCollected: order.partialPayment.remainingToPay
    });

  } catch (err) {
    console.error("Admin confirm hybrid COD error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ORDER STATUS =================
router.get("/order-status/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      orderId: order.customOrderId,
      paymentMethod: order.paymentMethod,
      status: order.status,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      partialPayment: order.partialPayment,
      requiresOnlinePayment: order.paymentMethod === "cod_hybrid" && order.status === "PAYMENT_PENDING",
      onlineAmount: order.paymentMethod === "cod_hybrid" ? 200 : null
    });
  } catch (err) {
    console.error("Order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= SHIPROCKET WEBHOOK =================
router.post("/shiprocket-webhook", express.json(), async (req, res) => {
  try {
    const { shipment_id, order_id, status, awb_code } = req.body;

    if (!shipment_id || !order_id) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const order = await Order.findOne({ customOrderId: order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    switch(status) {
      case "Manifested":
      case "Shipped":
        order.orderStatus = "Shipped";
        break;
      case "In Transit":
        order.orderStatus = "In Transit";
        break;
      case "Out for Delivery":
        order.orderStatus = "Out for Delivery";
        break;
      case "Delivered":
        order.orderStatus = "Delivered";
        order.deliveredAt = new Date();
        break;
      case "RTO":
        order.orderStatus = "Returned to Origin";
        break;
      case "Cancelled":
        order.orderStatus = "Cancelled";
        break;
      default:
        order.orderStatus = status;
    }

    order.shiprocketStatus = status;
    order.awbCode = awb_code || order.awbCode;
    order.lastTrackingUpdate = new Date();
    
    await order.save();

    console.log(`✅ ShipRocket webhook processed: ${order_id} - ${status}`);
    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("❌ ShipRocket webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

module.exports = router;