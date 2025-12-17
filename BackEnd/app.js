
require("dotenv").config();
// app.js
const express = require("express");
const app = express();
const http = require("http");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./Model/UserSchema");
const Product = require("./Model/Product.add.admin");
const Cart = require("./Model/Cart");
const Order = require("./Model/order");
const OrderTracking = require("./Model/order.traking");
const bodyParser = require("body-parser");
const tempOtp = {};
const twilio = require("twilio");
// Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fs = require("fs");
require("./db/conn");
require("./Model/mobile");
require("./Model/order.traking");
const cors = require('cors');
const { PaymentHandler, validateHMAC_SHA256, APIException } = require("./payment/PaymentHandler");
const crypto = require("crypto");
app.use(cors());
const server = http.createServer(app);
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  "/images",
  express.static("D:\\Job\\Telve\\tolvv\\public\\images")
);
// Multer setup
const OTP_EXPIRY_TIME = 5 * 60 * 1000;
// JWT authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
app.use(express.urlencoded({ extended: true }));

app.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile)
    return res.status(400).json({ success: false, message: "Mobile number is required." });

  if (!/^[6-9]\d{9}$/.test(mobile))
    return res.status(400).json({ success: false, message: "Invalid phone number." });

  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    tempOtp[mobile] = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_TIME,
    };

    // 📩 Send SMS using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: `+91${mobile}`, // User phone
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
    });

    console.log(`OTP sent to ${mobile}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully." });

  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Check Twilio account details.",
      error: error.message,
    });
  }
});

app.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  if (!tempOtp[mobile])
    return res.status(400).json({ success: false, message: "OTP not found. Please resend." });

  if (tempOtp[mobile].expiresAt < Date.now())
    return res.status(400).json({ success: false, message: "OTP has expired." });

  if (tempOtp[mobile].otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP." });

  tempOtp[mobile].verified = true;

  res.json({ success: true, message: "OTP verified successfully." });
});
// Signup
app.post("/signup", async (req, res) => {
  const { fname, lname, password, mobile, role } = req.body;
  if (!fname || !lname || !password || !mobile) {
    return res.status(400).json({ message: "All fields including mobile number are required" });
  }
  if (!tempOtp[mobile] || !tempOtp[mobile].verified) {
    return res.status(400).json({ message: "Mobile number not verified. Please verify OTP first." });
  }

  try {
    const userExists = await User.findOne({ mobile });
    if (userExists) return res.status(400).json({ message: "Mobile number already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ fname, lname, password: hashed, mobile, role: role || 'user' });
    await user.save();

    delete tempOtp[mobile];

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) return res.status(400).json({ message: "Mobile number and password are required" });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "User not found. Please sign up." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Include email and mobile in JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login successful", token, role: user.role, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Forgot password
// Forgot password - updated to send SMS
// Send OTP
app.post("/forgot-password", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: "Mobile number is required." });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    tempOtp[mobile] = { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME };

    console.log(`Sending OTP to +91${mobile}: ${otp}`); // debug

    try {
      await client.messages.create({
        body: `Your password reset OTP is ${otp}`,
        to: `+91${mobile}`,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (err) {
      console.warn(`Twilio error: ${err.message}`);
    }

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify reset OTP
app.post("/verify-reset-otp", async (req, res) => {
  const { mobile, Otp } = req.body;
  const record = tempOtp[mobile];
  if (!record) return res.status(400).json({ message: "OTP not found or expired." });

  if (record.otp !== Otp) return res.status(400).json({ message: "Invalid OTP." });
  if (Date.now() > record.expiresAt) {
    delete tempOtp[mobile];
    return res.status(400).json({ message: "OTP expired." });
  }

  tempOtp[mobile].verified = true;
  res.status(200).json({ message: "OTP verified successfully." });
});
// Reset password
app.post("/reset-password", async (req, res) => {
  const { mobile, newPassword } = req.body;
  if (!mobile || !newPassword) return res.status(400).json({ message: "Mobile and new password are required." });

  const record = tempOtp[mobile];
  if (!record || !record.verified) return res.status(400).json({ message: "OTP not verified." });

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    delete tempOtp[mobile];
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User dashboard
app.get("/user/dashboard", authenticate, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: "Access denied: Users only" });
  try {
    const availableProducts = await Product.find();
    const userOrders = await Order.find({ userId: req.user.id }).populate('items.productId').sort({ createdAt: -1 });

    const orderDetails = userOrders.map(order => ({
      orderId: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      deliveryAddress: order.address,
      placedAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.productId ? item.productId.ProductName : 'Product Not Found',
        quantity: item.quantity,
        pricePerItem: item.productId ? item.productId.ProductPrice : 0
      }))
    }));

    res.status(200).json({ message: "Welcome to User Dashboard", availableProducts, orders: orderDetails });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct('Category');
    res.status(200).json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Products by Zodiac sign (with optional category via query)
app.get("/products/zodiac/:zodiac", async (req, res) => {
  try {
    const { zodiac } = req.params;
    const { category } = req.query;

    const query = { Zodiac: zodiac };
    if (category && category !== "All") query.Category = category;

    const products = await Product.find(query);
    if (!products.length)
      return res.status(404).json({ message: "No products found for this zodiac." });

    res.status(200).json(products);
  } catch (error) {
    console.error("Zodiac products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to cart
app.post("/add-to-cart", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [{ productId, quantity: quantity || 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity: quantity || 1 });
      }
    }
    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Place order
app.post("/place-order", authenticate, async (req, res) => {
  try {
    const { items, paymentMethod, address } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!address || !address.city || !address.pincode)
      return res.status(400).json({ message: "Address incomplete" });

    let subtotal = 0;
    items.forEach(item => subtotal += item.price * item.qty);


    const totalAmount = +(subtotal).toFixed(2);

    const customOrderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Save order to DB
    const newOrder = new Order({
      userId: req.user.id,
      customOrderId,
      items: items.map(i => ({
        productId: i.id,
        quantity: i.qty,
        priceAtBuy: i.price
      })),
      subtotal,
      totalAmount,
      paymentMethod,
      orderStatus: "Pending",   // Delivery status
      status: "PENDING",        // Payment will update later
      address
    });


    await newOrder.save();

    await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

    if (paymentMethod === "card" || paymentMethod === "upi") {
      const paymentHandler = PaymentHandler.getInstance();
      const sessionResp = await paymentHandler.orderSession({
        order_id: customOrderId,          // mandatory
        amount: Number(totalAmount.toFixed(2)), // must be `amount`
        currency: "INR",
        customer_id: req.user.id.toString(),
        customer_mobile: req.user.mobile,
        return_url: process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/payment"
      });

      if (sessionResp?.payment_links?.web) {
        return res.status(201).json({
          message: "Order placed, redirecting to payment",
          redirect: sessionResp.payment_links.web
        });
      }

      return res.status(500).json({ message: "Payment session creation failed" });
    }

    res.status(201).json({ message: "Order placed successfully", orderId: customOrderId });
  } catch (err) {
    console.error("Place order error:", err);
    if (err instanceof APIException) {
      return res.status(400).json({
        message: "Payment API error",
        error: err.errorMessage || err.message,
        code: err.errorCode
      });
    }
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/payment-callback", async (req, res) => {
  const { order_id } = req.body;
  const paymentHandler = PaymentHandler.getInstance();

  try {
    if (!validateHMAC_SHA256(req.body, paymentHandler.getResponseKey())) {
      return res.status(400).send("Invalid signature");
    }

    const orderStatusResp = await paymentHandler.orderStatus(order_id);
    await Order.findOneAndUpdate(
      { customOrderId: order_id },
      { status: orderStatusResp.status }
    );

    res.send(`<h1>Payment ${orderStatusResp.status}</h1>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment verification failed");
  }
});

app.get("/order/status/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ customOrderId: req.params.orderId })
      .populate("items.productId");

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
app.get("/order/details/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ customOrderId: req.params.orderId });
    const tracking = await OrderTracking.findOne({ orderId: req.params.orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      orderId: order.customOrderId,
      paymentStatus: order.status,
      totalAmount: order.totalAmount,
      deliveryStatus: tracking?.deliveryStatus || "ORDER_PLACED",
      timeline: tracking?.timeline || []
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/cart', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.status(200).json({ message: 'Cart is empty', cart: [] });
    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.productId && item.productId.ProductPrice) totalPrice += item.quantity * item.productId.ProductPrice;
    });
    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item
app.delete('/cart/remove/:productId', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /products - fetch all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /products/category/:category - fetch products by category
app.get("/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = category === "All"
      ? await Product.find()
      : await Product.find({ Category: category });
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/image/:category/:filename", authenticate, (req, res) => {
  const { category, filename } = req.params;
  const imagePath = path.join(__dirname, "public", "images", category, filename);
  if (!fs.existsSync(imagePath)) return res.status(404).json({ message: "Image not found" });
  res.sendFile(imagePath);
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});