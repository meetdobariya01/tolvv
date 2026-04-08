
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../Model/order");
const Product = require("../Model/Product.add.admin");
const Cart = require("../Model/Cart");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");
const {
  sendAdminSubscriptionNotification,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} = require("../utils/email.service");
const Hamper = require("../Model/Hamper");
const ShipRocketService = require("../services/shiprocket.service");

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
      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
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

    console.log("Creating ShipRocket order for:", order.customOrderId, "Payment:", order.paymentMethod);
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

// ================= PLACE ORDER (UPDATED FOR COD) =================
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
      shippingCharge = 98;
    } else {
      shippingCharge = totalItems * 35;
    }

    let codCharge = 0;
    if (paymentMethod === "cod") {
      codCharge = 200;
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

    const totalAmount = Math.round(subtotal - discount + shippingCharge + codCharge);
    const customOrderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
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
      status: paymentMethod === "cod" ? "COD_CONFIRMED" : "PAYMENT_PENDING",
      orderStatus: paymentMethod === "cod" ? "Confirmed" : "Pending",
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
    await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

    // ================= FOR COD ORDERS: Send Email & Create ShipRocket =================
    if (paymentMethod === "cod") {
      const user = await User.findById(req.user.id);
      
      // Send emails
      await sendOrderEmails(newOrder, user);
      
      // Create ShipRocket shipment (delay to ensure order is saved)
      setTimeout(async () => {
        await createShipRocketShipment(newOrder);
      }, 2000);
    }

    res.status(201).json({
      message: paymentMethod === "cod" ? "Order placed successfully" : "Order placed, proceed to payment",
      orderId: customOrderId,
      requiresPayment: paymentMethod !== "cod",
      codChargeApplied: codCharge
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OTHER ROUTES (keep existing) =================
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