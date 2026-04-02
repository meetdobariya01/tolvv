const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../Model/order");
const Product = require("../Model/Product.add.admin");
const Cart = require("../Model/Cart");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");
const {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendAdminSubscriptionNotification
} = require("../utils/email.service");
const Hamper = require("../Model/Hamper");
const COUPONS = {
  LAUNCH5: { discount: 5, firstOrderOnly: true },
  WELCOME10: { discount: 10, firstOrderOnly: true },
  IVY755WA: { discount: 15, firstOrderOnly: false }
};
const validateCoupon = async (code, userId) => {
  const coupon = COUPONS[code];

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  const existingOrders = await Order.find({
    userId,
    status: { $in: ["PAID", "COD_CONFIRMED"] }
  });

  const isFirstOrder = existingOrders.length === 0;

  if (coupon.firstOrderOnly && !isFirstOrder) {
    throw new Error("This coupon is valid only for first order");
  }

  return coupon.discount; // return percent
};


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

    // ✅ VALIDATIONS
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!address || !address.city || !address.pincode)
      return res.status(400).json({ message: "Address incomplete" });

    if (!address?.mobile)
      return res.status(400).json({ message: "Phone number required" });

    let subtotal = 0;
    const orderItems = [];

    // ✅ CALCULATE SUBTOTAL
    for (const item of items) {

      // ✅ VALIDATE PRODUCT ID
      if (item.productId) {

        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          return res.status(400).json({ message: "Invalid productId" });
        }

        const product = await Product.findById(item.productId);

        if (!product)
          return res.status(404).json({ message: "Product not found" });

        // ✅ FREE PRODUCT LOGIC
        const isFree = item.isFree === true;

        if (!isFree) {
          subtotal += product.ProductPrice * item.quantity;
        }

        orderItems.push({
          productId: product._id,
          productName: isFree ? `${product.ProductName} (FREE)` : product.ProductName,
          quantity: item.quantity,
          priceAtBuy: isFree ? 0 : product.ProductPrice,
          isFree: isFree // optional
        });
      }

      // ✅ VALIDATE HAMPER ID
      if (item.hamperId) {

        const hamper = await Hamper.findById(item.hamperId)
          .populate("products.productId");

        if (!hamper)
          return res.status(404).json({ message: "Hamper not found" });

        subtotal += hamper.totalPrice * item.quantity;

        let hamperItems = hamper.products.map((p) => ({
          productId: p.productId._id,
          name: p.productId.ProductName,
          quantity: p.quantity,
          isFree: false
        }));

        // ✅ MANUAL FREE ITEM (NO DB)
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

    // ✅ CHECK FIRST ORDER
    const existingOrders = await Order.find({
      userId: req.user.id,
      status: { $in: ["PAID", "COD_CONFIRMED"] }
    });

    const isFirstOrder = existingOrders.length === 0;

    // ✅ APPLY COUPON
    let discount = 0;
    let discountPercent = 0;

    if (couponCode) {
      const code = couponCode.toUpperCase();

      try {
        discountPercent = await validateCoupon(code, req.user.id);
      } catch (err) {
        return res.status(400).json({
          message: err.message
        });
      }

      discount = (subtotal * discountPercent) / 100;
    }

    // ✅ FINAL TOTAL
    const totalAmount = Math.round(subtotal - discount);

    // ✅ GENERATE ORDER ID
    const customOrderId = `ord_${Date.now()}_${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // ✅ CREATE ORDER
    const newOrder = new Order({
      userId: req.user.id,
      customOrderId,
      subscribe,
      customerName,
      customerEmail,

      items: orderItems,

      subtotal,          // ✅ FIXED
      totalAmount,       // ✅ FIXED
      discount,          // ✅ IMPORTANT SAVE
      couponCode,

      paymentMethod,
      status:
        paymentMethod === "cod"
          ? "COD_CONFIRMED"
          : "PAYMENT_PENDING",

      address: {
        houseNumber: address.houseNumber,
        buildingName: address.buildingName,
        societyName: address.societyName,
        road: address.road,
        landmark: address.landmark,
        city: address.city,
        pincode: address.pincode,
        mobile: address.mobile
      },

      note: note || ""
    });

    await newOrder.save();

    if (subscribe) {
      sendAdminSubscriptionNotification(customerEmail, customerName)
        .catch(err => console.error("Subscription Mail Error:", err));
    }
    // ✅ CLEAR CART
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } }
    );

    // ✅ EMAIL
    const user = await User.findById(req.user.id);

    const products = await Product.find({
      _id: { $in: orderItems.map(i => i.productId).filter(Boolean) }
    });
    const itemsHtml = orderItems.map(i => {

      // ✅ NORMAL PRODUCT
      if (!i.hamperItems) {
        return `<li>${i.productName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`;
      }

      // ✅ HAMPER WITH ITEMS
      const hamperList = i.hamperItems.map(h => {
        return `<li style="margin-left:15px;">
      - ${h.name} × ${h.quantity} ${h.isFree ? "(FREE)" : ""}
    </li>`;
      }).join("");

      return `
    <li>
      <strong>${i.productName}</strong> — ₹${i.priceAtBuy} × ${i.quantity}
      <ul>${hamperList}</ul>
    </li>
  `;
    }).join("");
    const orderDetails = {
      customOrderId,
      paymentMethod,
      totalAmount,
      itemsHtml,
      phone: address.mobile
    };

    sendOrderConfirmationEmail(user.email, orderDetails)
      .catch(err => console.error(err));

    sendAdminOrderNotification(orderDetails, user, address, note)
      .catch(err => console.error(err));

    // ✅ PAYMENT FLOW
    if (paymentMethod === "card" || paymentMethod === "upi") {
      return res.status(201).json({
        message: "Order placed, proceed to payment",
        orderId: customOrderId,
        requiresPayment: true
      });
    }

    // ✅ COD
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
router.get("/current-orders", authenticate, async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const orders = await Order.find({
      userId: req.user.id,
      createdAt: { $gte: fiveDaysAgo }
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

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
    })
      .populate("items.productId")
      .populate("items.hamperId")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("Previous orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/coupon/validate", authenticate, async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ message: "Coupon required" });
    }

    const code = couponCode.toUpperCase();
    const coupon = COUPONS[code];

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    const existingOrders = await Order.find({
      userId: req.user.id,
      status: { $in: ["PAID", "COD_CONFIRMED"] }
    });

    const isFirstOrder = existingOrders.length === 0;

    if (coupon.firstOrderOnly && !isFirstOrder) {
      return res.status(400).json({
        message: "This coupon is valid only for first order"
      });
    }

    return res.json({
      valid: true,
      discountPercent: coupon.discount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;