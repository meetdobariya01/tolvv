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

// ================= SHIPROCKET INTEGRATION =================
const ShipRocketService = require("../services/shiprocket.service");
const COD_ADVANCE_AMOUNT = 200;

// Helper function to create ShipRocket shipment (FIXED)
async function createShipRocketShipment(order) {
  try {
    const shiprocket = ShipRocketService.getInstance();

    // Format phone number
    function formatPhoneNumber(phone) {
      if (!phone) return "9999999999";
      let cleaned = String(phone).replace(/\D/g, '');
      if (cleaned.length === 12 && cleaned.startsWith('91')) cleaned = cleaned.substring(2);
      if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
      if (cleaned.length === 10) return cleaned;
      if (cleaned.length > 10) return cleaned.slice(-10);
      return cleaned.padStart(10, '0');
    }

    const formattedPhone = formatPhoneNumber(order.address.mobile);

    // Build full address from available fields
    const addressParts = [
      order.address.houseNumber,
      order.address.buildingName,
      order.address.societyName,
      order.address.road
    ].filter(Boolean);

    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : order.address.street || "Address not provided";

    // Prepare order items for ShipRocket
    const orderItems = order.items.map(item => ({
      name: item.productName.substring(0, 100),
      sku: item.productId?.toString() || item.hamperId?.toString() || "CUSTOM",
      units: item.quantity,
      selling_price: Math.round(item.priceAtBuy),
      discount: 0,
      tax: 0,
      hsn: 0
    }));

    // ✅ CRITICAL FIX: Calculate the correct COD amount
    let codAmount = 0;
    let subtotalForShiprocket = 0;

    if (order.paymentMethod === "cod_hybrid") {
      // For hybrid COD: Only the remaining amount is collected on delivery
      codAmount = order.partialPayment?.remainingToPay || (order.totalAmount - COD_ADVANCE_AMOUNT);
      subtotalForShiprocket = codAmount;
    } else if (order.paymentMethod === "cod") {
      codAmount = order.totalAmount;
      subtotalForShiprocket = order.totalAmount;
    } else {
      // Prepaid orders
      subtotalForShiprocket = order.totalAmount;
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
      payment_method: (order.paymentMethod === "cod" || order.paymentMethod === "cod_hybrid") ? "COD" : "Prepaid",
      ...(codAmount > 0 && { cod_amount: codAmount }),
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: Math.round(subtotalForShiprocket),
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.totalWeight || 1.0
    };

    console.log("📦 Creating ShipRocket order for:", order.customOrderId);
    console.log("📦 COD Amount:", codAmount);
    console.log("📦 Subtotal:", subtotalForShiprocket);
    
    const response = await shiprocket.createOrder(shiprocketOrderData);

    if (response && response.status === 200) {
      order.shiprocketOrderId = response.data.order_id;
      order.shiprocketShipmentId = response.data.shipment_id;
      order.orderStatus = "Processing for Shipping";
      await order.save();
      console.log(`✅ ShipRocket order created successfully for ${order.customOrderId} with COD amount: ₹${codAmount}`);
      return true;
    }

    throw new Error("ShipRocket order creation failed");
  } catch (error) {
    console.error(`❌ Failed to create ShipRocket shipment for ${order.customOrderId}:`, error.response?.data || error.message);
    return false;
  }
}

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
      amount: order.paymentMethod === "cod_hybrid"
        ? order.partialPayment?.paidOnline || COD_ADVANCE_AMOUNT
        : order.totalAmount,
      currency: "INR",
      customer_id: req.user.id.toString(),
      customer_mobile: req.user.mobile,
      return_url: process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/api/payment/callback",
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

// ================= CREATE SHIPROCKET ORDER (Manual) =================
router.post("/create-shipment/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.status !== "PAID" &&
      order.status !== "COD_CONFIRMED" &&
      order.status !== "PARTIALLY_PAID_COD"
    ) {
      return res.status(400).json({ message: "Order not confirmed yet" });
    }

    if (order.shiprocketShipmentId) {
      return res.status(400).json({ message: "Shipment already created" });
    }

    const success = await createShipRocketShipment(order);

    if (success) {
      return res.json({
        success: true,
        message: "Shipment created successfully",
        data: {
          shiprocketOrderId: order.shiprocketOrderId,
          shiprocketShipmentId: order.shiprocketShipmentId
        }
      });
    } else {
      throw new Error("ShipRocket order creation failed");
    }

  } catch (err) {
    console.error("ShipRocket order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: err.message
    });
  }
});

// ================= GENERATE SHIPROCKET LABEL =================
router.post("/generate-label/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order || !order.shiprocketShipmentId) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const shiprocket = ShipRocketService.getInstance();
    const response = await shiprocket.generateLabel(order.shiprocketShipmentId);

    if (response && response.status === 200) {
      order.shiprocketLabelUrl = response.data.label_url;
      order.awbCode = response.data.awb_code;
      await order.save();

      return res.json({
        success: true,
        label_url: response.data.label_url,
        awb_code: response.data.awb_code
      });
    }

    throw new Error("Label generation failed");

  } catch (err) {
    console.error("Label generation error:", err);
    res.status(500).json({ message: "Failed to generate label" });
  }
});

// ================= TRACK SHIPMENT =================
router.get("/track/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order || !order.shiprocketShipmentId) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const shiprocket = ShipRocketService.getInstance();
    const response = await shiprocket.trackShipment(order.shiprocketShipmentId);

    if (response && response.status === 200) {
      order.trackingStatus = response.data.tracking_status;
      order.trackingData = response.data;
      await order.save();

      return res.json({
        success: true,
        tracking: response.data
      });
    }

    throw new Error("Tracking failed");

  } catch (err) {
    console.error("Tracking error:", err);
    res.status(500).json({ message: "Failed to track shipment" });
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

    switch (status) {
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
        if (order.paymentMethod === "cod_hybrid") {
          order.status = "COD_CONFIRMED";
        }
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

// ================= GET SHIPPING COST ESTIMATE =================
router.post("/estimate-shipping", authenticate, async (req, res) => {
  try {
    const { pincode, weight, dimensions } = req.body;

    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    const shiprocket = ShipRocketService.getInstance();
    const response = await shiprocket.calculateShipping({
      pickup_postcode: process.env.PICKUP_PINCODE || "380015",
      delivery_postcode: pincode,
      weight: weight || 1.0,
      length: dimensions?.length || 10,
      breadth: dimensions?.breadth || 10,
      height: dimensions?.height || 10
    });

    if (response && response.status === 200) {
      return res.json({
        success: true,
        shipping_charge: response.data.shipping_charge,
        estimated_days: response.data.estimated_delivery_days,
        courier_company: response.data.courier_name
      });
    }

    throw new Error("Shipping estimation failed");

  } catch (err) {
    console.error("Shipping estimation error:", err);
    res.status(500).json({ message: "Failed to estimate shipping" });
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

    const expectedAmount = order.paymentMethod === "cod_hybrid"
      ? order.partialPayment?.paidOnline || COD_ADVANCE_AMOUNT
      : order.totalAmount;

    if (Math.round(amount_paid) !== Math.round(expectedAmount)) {
      order.status = "AMOUNT_MISMATCH";
      await order.save();
      return res.status(400).json({ message: "Amount mismatch" });
    }

    if (payment_status === "SUCCESS") {
      if (order.paymentMethod === "cod_hybrid") {
        order.status = "PARTIALLY_PAID_COD";
        order.orderStatus = "Partial Payment Received";
        order.partialPayment = {
          ...order.partialPayment,
          paidOnline: order.partialPayment?.paidOnline || COD_ADVANCE_AMOUNT,
          remainingToPay: order.partialPayment?.remainingToPay || (order.totalAmount - COD_ADVANCE_AMOUNT),
          paymentMode: "COD_HYBRID",
          transactionId: transaction_id,
          paidAt: new Date(),
        };
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

      // ✅ CREATE SHIPROCKET SHIPMENT FOR HYBRID COD AFTER PAYMENT
      if (order.paymentMethod === "cod_hybrid" && !order.shiprocketShipmentId) {
        await createShipRocketShipment(order);
      }

    } else {
      order.status = "PAYMENT_FAILED";
      await order.save();
    }

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
      if (order.paymentMethod === "cod_hybrid") {
        order.status = "PARTIALLY_PAID_COD";
        order.orderStatus = "Partial Payment Received";
      } else {
        order.status = "PAID";
        order.orderStatus = "Confirmed";
      }
      
      await order.save();

      if (!order.emailSent) {
        order.emailSent = true;
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

      // ✅ CREATE SHIPROCKET SHIPMENT FOR HYBRID COD AFTER PAYMENT
      if (order.paymentMethod === "cod_hybrid" && !order.shiprocketShipmentId) {
        await createShipRocketShipment(order);
      }

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