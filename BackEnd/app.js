
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
const axios = require("axios");
const Order = require("./Model/order");
//const OrderTracking = require("./Model/order.traking");
const bodyParser = require("body-parser");
const tempOtp = {};
const nodemailer = require("nodemailer");
const tempEmailOtp = {};
const asyncHandler = require("express-async-handler");
require("./db/conn");
require("./Model/mobile");
require("./Model/order.traking");
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
//const Shiprocket = require("../Model/order.traking"");
//const { createShiprocketOrder } = require("../services/shiprocket.service");

const { PaymentHandler, validateHMAC_SHA256, APIException } = require("./payment/PaymentHandler");
const crypto = require("crypto");
//app.use(cors());
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const transporter = nodemailer.createTransport({
    service: "gmail", // or your Hostinger email SMTP
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
   }
});
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  "/images",
  express.static("D:\\Job\\Telve\\tolvv\\public\\images")
);
app.use("/uploads", express.static("D:\\Job\\Telve\\Admin\\BackEnd\\uploads"));
// Multer setup
const OTP_EXPIRY_TIME = 5 * 60 * 1000;
// JWT authentication middleware

let shiprocketToken = null;
let tokenExpiry = null;

// Login to Shiprocket and get token
async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken; // reuse token
  }

  const res = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
    email: process.env.SHIPROCKET_CLIENT_ID,
    password: process.env.SHIPROCKET_CLIENT_SECRET,
  });

  shiprocketToken = res.data.token;
  tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  return shiprocketToken;
}

// Create a shipment in Shiprocket
async function createShiprocketOrder(order) {
  try {
    const token = await getShiprocketToken();

    const shipmentData = {
      order_id: order.customOrderId,
      order_date: new Date().toISOString().split("T")[0], // ✅ FIXED
      channel_id: Number(process.env.SHIPROCKET_CHANNEL_ID),

      billing_customer_name: order.customerName,
      billing_last_name: "",
      billing_address: order.address.houseNumber,
      billing_city: order.address.city,
      billing_state: order.address.state || "Delhi",
      billing_country: "India",
      billing_pincode: order.address.pincode,
      billing_email: order.customerEmail,
      billing_phone: order.address.phone || "9999999999",

      shipping_is_billing: true,

      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid", // ✅ REQUIRED

      order_items: order.items.map(i => ({
        name: i.productName,
        sku: i.productId.toString(),
        units: i.quantity,
        selling_price: i.priceAtBuy
      })),

      // ✅ STRONGLY RECOMMENDED
      weight: 0.5,
      length: 10,
      breadth: 10,
      height: 10
    };

    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      shipmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;

  } catch (error) {
    console.error(
      "❌ Shiprocket API error:",
      error.response?.data || error.message
    );
    return null;
  }
}


const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists. Please login again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
app.use(express.urlencoded({ extended: true }));
app.get("/api/image/:category/:filename", (req, res) => {
  const { category, filename } = req.params;
  const imagePath = path.join(__dirname, "public", "images", category, filename);

  if (!fs.existsSync(imagePath)) return res.status(404).json({ message: "Image not found" });

  res.sendFile(imagePath);
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    tempOtp[email] = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_TIME,
    };

    await transporter.sendMail({
  from: `"Tolvv Support" <no-reply@tolvv.com>`,
  replyTo: "no-reply@tolvv.com",
  to: email,
  subject: "OTP Verification – Secure Login",
  html: `
    <div style="font-family: Arial, sans-serif; color:#333;">
      <p>Dear User,</p>

      <p>We received a request to log in to your account.</p>

      <p>Your OTP code is:</p>

      <div style="
        font-size: 28px;
        font-weight: bold;
        color: #000;
        text-align: center;
        letter-spacing: 6px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p><strong>⏳ Valid for 5 minutes</strong></p>

      <p style="font-size: 13px; color: #555;">
        For your security:
        <br/>• Do not share this OTP with anyone
        <br/>• Our team will never ask for your OTP
      </p>

      <p>
        Regards,<br/>
        <strong>Tolvv – Nurture your Nature</strong><br/>
        Support Team
      </p>
    </div>
  `,
});


    console.log(`OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
});
// Add this to your app.js
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Fetch single product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!tempOtp[email])
    return res.status(400).json({ success: false, message: "OTP not found. Please resend." });

  if (tempOtp[email].expiresAt < Date.now())
    return res.status(400).json({ success: false, message: "OTP has expired." });

  if (tempOtp[email].otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP." });

  tempOtp[email].verified = true;
  res.json({ success: true, message: "OTP verified successfully." });
});
// Signup
app.post("/signup", async (req, res) => {
  const { fname, lname, email, password, mobile, role } = req.body;

  if (!fname || !lname || !email || !password || !mobile) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fname,
      lname,
      email,
      mobile,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.googleAuth) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/googlelogin", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    const { email, given_name, family_name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fname: given_name || "Google",
        lname: family_name || "User",
        email,
        googleAuth: true, // 🔥 REQUIRED
        // ❌ DO NOT set password
        // ❌ DO NOT set mobile
      });

      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token: jwtToken });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ success: false, message: "Google login failed" });
  }
});
// Forgot password
// Forgot password - updated to send SMS
// Send OTP
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    tempEmailOtp[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      verified: false,
    };

    await transporter.sendMail({
      from: `"Tolvv Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h3>Password Reset</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify reset OTP
app.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = tempEmailOtp[email];
  if (!record) {
    return res.status(400).json({ message: "OTP not found or expired" });
  }

  if (Date.now() > record.expiresAt) {
    delete tempEmailOtp[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  record.verified = true;

  res.status(200).json({ message: "OTP verified successfully" });
});
// Reset password
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const record = tempEmailOtp[email];
  if (!record || !record.verified) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    delete tempEmailOtp[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
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
app.post("/api/add-to-cart", authenticate, async (req, res) => {
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
// app.post("/place-order", authenticate, async (req, res) => {
//   try {
//     const { items, paymentMethod, address, note, customerName, customerEmail } = req.body;

//     if (!items || items.length === 0)
//       return res.status(400).json({ message: "Cart is empty" });

//     if (!address || !address.city || !address.pincode)
//       return res.status(400).json({ message: "Address incomplete" });

//     if (!customerName || !customerEmail)
//       return res.status(400).json({ message: "Name and Email are required" });

//     let subtotal = 0;
//     const orderItems = [];

//     // 🔐 PRICE VALIDATION
//     for (const item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product)
//         return res.status(404).json({ message: "Product not found" });

//       subtotal += product.ProductPrice * item.quantity;

//       orderItems.push({
//         productId: product._id,
//         productName: product.ProductName, // save product name
//         quantity: item.quantity,
//         priceAtBuy: product.ProductPrice
//       });
//     }

//     const totalAmount = Math.round(subtotal);
//     const customOrderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

//     // 📦 CREATE ORDER
//     const newOrder = new Order({
//       userId: req.user.id,
//       customOrderId,
//       customerName,
//       customerEmail,
//       items: orderItems,
//       subtotal: totalAmount,
//       totalAmount,
//       paymentMethod,
//       status: paymentMethod === "cod" ? "COD_CONFIRMED" : "PAYMENT_PENDING",
//       address,
//       note: note || ""
//     });

//     await newOrder.save();

//     // 🧹 CLEAR CART
//     await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

//     /* ================= EMAIL SECTION ================= */
//     const user = await User.findById(req.user.id);
//     const itemsHtml = orderItems.map(i =>
//       `<li>${i.productName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`
//     ).join("");

//     // User email
//     transporter.sendMail({
//       from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
//       to: customerEmail,
//       subject: "✅ Order Confirmed – Tolvv",
//       html: `
//         <h2>Thank you for your order 🎉</h2>
//         <p><strong>Order ID:</strong> ${customOrderId}</p>
//         <p><strong>Payment Method:</strong> ${paymentMethod}</p>
//         <p><strong>Total:</strong> ₹${totalAmount}</p>
//         <ul>${itemsHtml}</ul>
//         <p>We’ll notify you once your order is shipped.</p>
//       `
//     }).catch(err => console.error("User mail error:", err));

//     // Admin email
//     transporter.sendMail({
//       from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "🚨 New Order Received – Tolvv",
//       html: `
//         <h2>🛒 New Order Placed</h2>
//         <p><strong>Order ID:</strong> ${customOrderId}</p>
//         <p><strong>Customer:</strong> ${customerName}</p>
//         <p><strong>Email:</strong> ${customerEmail}</p>
//         <p><strong>Phone:</strong> ${address.phone || "N/A"}</p>
//         <p><strong>Payment:</strong> ${paymentMethod}</p>
//         <p><strong>Total:</strong> ₹${totalAmount}</p>
//         <p><strong>Address:</strong> ${address.houseNumber}, ${address.city} - ${address.pincode}</p>
//         <ul>${itemsHtml}</ul>
//         ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
//       `
//     }).catch(err => console.error("Admin mail error:", err));

//     /* ================= PAYMENT ================= */
//     if (paymentMethod === "card" || paymentMethod === "upi") {
//       const paymentHandler = PaymentHandler.getInstance();
//       const sessionResp = await paymentHandler.orderSession({
//         order_id: customOrderId,
//         amount: totalAmount,
//         currency: "INR",
//         customer_id: req.user.id.toString(),
//         customer_mobile: address.phone || user.mobile,
//         return_url: process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/payment-callback"
//       });

//       if (sessionResp?.payment_links?.web) {
//         return res.status(201).json({
//           message: "Order placed, redirecting to payment",
//           redirect: sessionResp.payment_links.web
//         });
//       }

//       return res.status(500).json({ message: "Payment session creation failed" });
//     }

//     // 💵 COD RESPONSE
//     res.status(201).json({
//       message: "Order placed successfully",
//       orderId: customOrderId
//     });

//   } catch (err) {
//     console.error("Place order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
app.post("/place-order", authenticate, async (req, res) => {
  try {
    const { items, paymentMethod, address, note, customerName, customerEmail } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!address || !address.city || !address.pincode)
      return res.status(400).json({ message: "Address incomplete" });

    if (!customerName || !customerEmail)
      return res.status(400).json({ message: "Name and Email are required" });

    let subtotal = 0;
    const orderItems = [];

    // 🔐 PRICE VALIDATION
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      subtotal += product.ProductPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.ProductName,
        quantity: item.quantity,
        priceAtBuy: product.ProductPrice
      });
    }

    const totalAmount = Math.round(subtotal);
    const customOrderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // 📦 CREATE ORDER IN DB
    const newOrder = new Order({
      userId: req.user.id,
      customOrderId,
      customerName,
      customerEmail,
      items: orderItems,
      subtotal: totalAmount,
      totalAmount,
      paymentMethod,
      status: paymentMethod === "cod" ? "COD_CONFIRMED" : "PAYMENT_PENDING",
      address,
      note: note || ""
    });

    await newOrder.save();

    // 🧹 CLEAR CART
    await Cart.findOneAndUpdate({ userId: req.user.id }, { $set: { items: [] } });

    /* ================= EMAIL SECTION ================= */
    const itemsHtml = orderItems.map(i =>
      `<li>${i.productName} — ₹${i.priceAtBuy} × ${i.quantity}</li>`
    ).join("");

    // User email
    transporter.sendMail({
      from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
      to: customerEmail,
      subject: "✅ Order Confirmed – Tolvv",
      html: `
        <h2>Thank you for your order 🎉</h2>
        <p><strong>Order ID:</strong> ${customOrderId}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ₹${totalAmount}</p>
        <ul>${itemsHtml}</ul>
        <p>We’ll notify you once your order is shipped.</p>
      `
    }).catch(err => console.error("User mail error:", err));

    // Admin email
    transporter.sendMail({
      from: `"Tolvv Orders" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🚨 New Order Received – Tolvv",
      html: `
        <h2>🛒 New Order Placed</h2>
        <p><strong>Order ID:</strong> ${customOrderId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${address.phone || "N/A"}</p>
        <p><strong>Payment:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ₹${totalAmount}</p>
        <p><strong>Address:</strong> ${address.houseNumber}, ${address.city} - ${address.pincode}</p>
        <ul>${itemsHtml}</ul>
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
      `
    }).catch(err => console.error("Admin mail error:", err));

    /* ================= SHIPROCKET ================= */
    try {
      const shiprocketResp = await createShiprocketOrder({
        customOrderId,
        customerName,
        customerEmail,
        address,
        items: orderItems
      });

      if (shiprocketResp) {
        console.log("Shiprocket order created:", shiprocketResp);
        // Optional: save Shiprocket ID in order
        newOrder.shiprocketOrderId = shiprocketResp.data.order_id;
        await newOrder.save();
      } else {
        console.error("Failed to create Shiprocket order");
      }
    } catch (err) {
      console.error("Shiprocket integration error:", err);
    }

    /* ================= PAYMENT ================= */
    if (paymentMethod === "card" || paymentMethod === "upi") {
      const paymentHandler = PaymentHandler.getInstance();
      const sessionResp = await paymentHandler.orderSession({
        order_id: customOrderId,
        amount: totalAmount,
        currency: "INR",
        customer_id: req.user.id.toString(),
        customer_mobile: address.phone || (await User.findById(req.user.id)).mobile,
        return_url: process.env.PAYMENT_CALLBACK_URL || "http://localhost:4000/payment-callback"
      });

      if (sessionResp?.payment_links?.web) {
        return res.status(201).json({
          message: "Order placed, redirecting to payment",
          redirect: sessionResp.payment_links.web
        });
      }

      return res.status(500).json({ message: "Payment session creation failed" });
    }

    // 💵 COD RESPONSE
    res.status(201).json({
      message: "Order placed successfully",
      orderId: customOrderId
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/payment/webhook", express.json(), async (req, res) => {
  try {
    // 🔐 BASIC AUTH SECURITY
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

    // 📦 WEBHOOK PAYLOAD
    const {
      order_id,
      payment_status,
      amount_paid,
      transaction_id,
    } = req.body;

    if (!order_id || !payment_status || !amount_paid || !transaction_id) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // 🔍 FIND ORDER
    const order = await Order.findOne({ customOrderId: order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 💰 AMOUNT VERIFICATION
    if (Math.round(amount_paid) !== Math.round(order.totalAmount)) {
      order.status = "AMOUNT_MISMATCH";
      await order.save();
      return res.status(400).json({ message: "Amount mismatch" });
    }

    // ✅ PAYMENT STATUS UPDATE
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

app.post("/payment-callback", async (req, res) => {
  const paymentHandler = PaymentHandler.getInstance();

  try {
    // 🔐 Signature validation
    if (!validateHMAC_SHA256(req.body, paymentHandler.getResponseKey())) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
      );
    }

    const { order_id } = req.body;

    const orderStatusResp = await paymentHandler.orderStatus(order_id);

    // Update order
    await Order.findOneAndUpdate(
      { customOrderId: order_id },
      {
        status: orderStatusResp.status === "CHARGED" ? "PAID" : "FAILED",
        orderStatus:
          orderStatusResp.status === "CHARGED" ? "Confirmed" : "Payment Failed"
      }
    );

    // ✅ Redirect to frontend success page
    if (orderStatusResp.status === "CHARGED") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment`
      );
    }

    // ❌ Failure redirect
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed/${order_id}`
    );

  } catch (err) {
    console.error("Payment callback error:", err);
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed`
    );
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

app.get("/api/cart", authenticate, async (req, res) => {
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
app.delete('/api/cart/remove/:productId', authenticate, async (req, res) => {
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
app.post("/merge", authenticate, async (req, res) => {
  try {
    const { guestItems } = req.body;

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return res.status(400).json({ message: "No items to merge" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
      });
    }

    guestItems.forEach((item) => {
      if (!item.productId || !item.quantity) return;

      const existingItem = cart.items.find(
        (ci) => ci.productId.toString() === item.productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += Number(item.quantity);
      } else {
        cart.items.push({
          productId: item.productId,
          quantity: Number(item.quantity),
        });
      }
    });

    await cart.save();

    res.status(200).json({
      message: "Cart merged successfully",
      cart,
    });

  } catch (error) {
    console.error("MERGE ERROR:", error);
    res.status(500).json({ message: "Merge failed" });
  }
});



// Start server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});