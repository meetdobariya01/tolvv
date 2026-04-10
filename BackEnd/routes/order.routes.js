const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../Model/order");
const Product = require("../Model/Product.add.admin");
const Cart = require("../Model/Cart");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");
const { createShipRocketShipment } = require("../services/shiprocket.helper"); // ✅ Import from helper
const {
  sendAdminSubscriptionNotification,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} = require("../utils/email.service");
const Hamper = require("../Model/Hamper");
const ADVANCE_AMOUNT = 200;
const COUPONS = {
  LAUNCH5: { discount: 5, firstOrderOnly: true },
  WELCOME10: { discount: 10, firstOrderOnly: true },
  IVY755WA: { discount: 15, firstOrderOnly: false }
};

// ================= HELPER FUNCTIONS =================
function formatPhoneNumber(phone) {
  if (!phone) return "9999999999";
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) cleaned = cleaned.substring(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length > 10) return cleaned.slice(-10);
  return cleaned.padStart(10, '0');
}

// ❌ REMOVE THIS ENTIRE FUNCTION - it's already imported above
// async function createShipRocketShipment(order) { ... } // DELETE THIS LINE AND THE WHOLE FUNCTION

async function sendOrderEmails(order, user) {
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

    const orderDetails = {
      customOrderId: order.customOrderId,
      paymentMethod: order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod,
      totalAmount: order.totalAmount,
      itemsHtml,
      phone: order.address.mobile,
    };

    await sendOrderConfirmationEmail(user.email, orderDetails);
    await sendAdminOrderNotification(orderDetails, user, order.address, order.note);
    console.log(`✅ Emails sent for ${order.customOrderId}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed for ${order.customOrderId}:`, error);
    return false;
  }
}

const validateCoupon = async (code, userId) => {
  const coupon = COUPONS[code];
  if (!coupon) throw new Error("Invalid coupon code");

  const existingOrders = await Order.find({
    userId,
    status: { $in: ["PAID", "COD_CONFIRMED"] }
  });
  const isFirstOrder = existingOrders.length === 0;

  if (coupon.firstOrderOnly && !isFirstOrder) {
    throw new Error("This coupon is valid only for first order");
  }
  return coupon.discount;
};

// ================= PLACE ORDER =================
router.post("/place", authenticate, async (req, res) => {
  try {
    const {
      items,
      paymentMethod,
      address,
      note,
      customerName,
      customerEmail,
      couponCode,
      subscribe
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!address || !address.city || !address.pincode)
      return res.status(400).json({ message: "Address incomplete" });
    if (!address?.mobile)
      return res.status(400).json({ message: "Phone number required" });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (item.productId) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          return res.status(400).json({ message: "Invalid productId" });
        }
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const isFree = item.isFree === true;
        if (!isFree) {
          subtotal += product.ProductPrice * item.quantity;
        }

        orderItems.push({
          productId: product._id,
          productName: isFree ? `${product.ProductName} (FREE)` : product.ProductName,
          quantity: item.quantity,
          priceAtBuy: isFree ? 0 : product.ProductPrice,
          isFree
        });
      }

      if (item.hamperId) {
        const hamper = await Hamper.findById(item.hamperId).populate("products.productId");
        if (!hamper) return res.status(404).json({ message: "Hamper not found" });
        subtotal += hamper.totalPrice * item.quantity;

        let hamperItems = hamper.products.map((p) => ({
          productId: p.productId._id,
          name: p.productId.ProductName,
          quantity: p.quantity,
          isFree: false
        }));

        if (item.addFreeProduct) {
          hamperItems.push({
            productId: null,
            name: "Complimentary Gift 🎁",
            quantity: 1,
            isFree: true
          });
        }

        orderItems.push({
          hamperId: hamper._id,
          productName: "Custom Hamper",
          quantity: item.quantity,
          priceAtBuy: hamper.totalPrice,
          hamperItems
        });
      }
    }

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    let shippingCharge = 0;
    if (subtotal >= 1500) {
      shippingCharge = 0;
    } else if (totalItems === 1) {
      shippingCharge = 90;
    } else {
      shippingCharge = totalItems * 35;
    }

    let discount = 0;
    let discountPercent = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase();
      try {
        discountPercent = await validateCoupon(code, req.user.id);
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
      discount = (subtotal * discountPercent) / 100;
    }

    const totalAmount = Math.round(subtotal - discount + shippingCharge);
    const customOrderId = `ORD${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const cleanPhone = formatPhoneNumber(address.mobile);

    // Create order
    const newOrder = new Order({
      userId: req.user.id,
      customOrderId,
      subscribe,
      customerName,
      customerEmail,
      items: orderItems,
      subtotal,
      discount,
      shippingCost: shippingCharge,
      totalAmount,
      couponCode,
      paymentMethod,
      partialPayment: paymentMethod === "cod_hybrid"
        ? {
            paidOnline: ADVANCE_AMOUNT,
            remainingToPay: Math.max(totalAmount - ADVANCE_AMOUNT, 0),
            paymentMode: "COD_HYBRID",
          }
        : {},
      status: paymentMethod === "cod"
        ? "COD_CONFIRMED"
        : paymentMethod === "cod_hybrid"
        ? "PARTIALLY_PAID_COD"
        : "PAYMENT_PENDING",
      orderStatus: paymentMethod === "cod"
        ? "Confirmed"
        : paymentMethod === "cod_hybrid"
        ? "Partial Payment Received"
        : "Pending",
      address: {
        ...address,
        mobile: cleanPhone,
        name: customerName,
        street: address.houseNumber || address.address,
        state: "Gujarat"
      },
      note: note || ""
    });

    await newOrder.save();
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        address: {
          name: customerName,
          houseNumber: address.houseNumber,
          buildingName: address.buildingName,
          city: address.city,
          pincode: address.pincode,
          mobile: cleanPhone
        }
      }
    });

    await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

    // ================= CREATE SHIPROCKET FOR REGULAR COD ONLY =================
    // Hybrid COD and UPI will create ShipRocket after payment confirmation
    if (paymentMethod === "cod") {
      const user = await User.findById(req.user.id);
      await sendOrderEmails(newOrder, user);
      setTimeout(async () => {
        await createShipRocketShipment(newOrder);
      }, 2000);
    }

    res.status(201).json({
      message: paymentMethod === "cod" ? "Order placed successfully" : "Order placed, proceed to payment",
      orderId: customOrderId,
      requiresPayment: paymentMethod !== "cod",
      advancePaid: paymentMethod === "cod_hybrid" ? ADVANCE_AMOUNT : 0
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OTHER ROUTES =================
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
        productName: item.productId?.ProductName || item.productName,
        quantity: item.quantity,
        price: item.priceAtBuy
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

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

router.put("/cancel/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      customOrderId: req.params.orderId,
      userId: req.user.id
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "PAID") {
      return res.status(400).json({ message: "Paid orders cannot be cancelled" });
    }
    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ message: "Order cancelled successfully", orderId: order.customOrderId });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/current-orders", authenticate, async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const orders = await Order.find({
      userId: req.user.id,
      createdAt: { $gte: fiveDaysAgo }
    }).populate("items.productId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Current orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/previous-orders", authenticate, async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const orders = await Order.find({
      userId: req.user.id,
      createdAt: { $lt: fiveDaysAgo }
    }).populate("items.productId").populate("items.hamperId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Previous orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/coupon/validate", authenticate, async (req, res) => {
  try {
    const { couponCode } = req.body;
    if (!couponCode) return res.status(400).json({ message: "Coupon required" });

    const code = couponCode.toUpperCase();
    const coupon = COUPONS[code];
    if (!coupon) return res.status(400).json({ message: "Invalid coupon" });

    const existingOrders = await Order.find({
      userId: req.user.id,
      status: { $in: ["PAID", "COD_CONFIRMED"] }
    });
    const isFirstOrder = existingOrders.length === 0;

    if (coupon.firstOrderOnly && !isFirstOrder) {
      return res.status(400).json({ message: "This coupon is valid only for first order" });
    }

    return res.json({ valid: true, discountPercent: coupon.discount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;