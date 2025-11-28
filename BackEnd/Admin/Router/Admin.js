// routes/admin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models - adjust paths if you kept them in different folders
const Admin = require("../Models/Admin");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const OrderTracking = require("../Models/order.tracking");

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

// ---------------------
// Simple in-memory token blacklist for logout.
// (For production, use Redis or DB)
const tokenBlacklist = new Set();
const path = require("path");


// ---------------------
// middleware: verify token + admin role
function adminAuth(req, res, next) {
  try {
    const auth = req.header("Authorization") || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ message: "No token provided" });
    if (tokenBlacklist.has(token)) return res.status(401).json({ message: "Token revoked" });

    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded expected to have role
    if (!decoded || decoded.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    req.admin = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ---------------------
// ADMIN AUTH: register
// Keeps it minimal: fname, lname, email, mobile, password
router.post("/register", async (req, res) => {
  try {
    const { fname, lname, email, mobile, password } = req.body;

    if (!fname || !lname || !email || !mobile || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Admin.findOne({ $or: [{ email }, { mobile }] });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const adminUser = new Admin({
      fname,
      lname,
      email,
      mobile,
      password: hashed,
      role: "admin"
    });

    await adminUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { mobile, password, email } = req.body;
    if (!password || (!mobile && !email)) return res.status(400).json({ message: "Provide mobile or email + password" });

    const query = mobile ? { mobile } : { email };
    const user = await Admin.findOne(query);
    if (!user) return res.status(400).json({ message: "Admin not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Not an admin account" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id.toString(), role: user.role, email: user.email, mobile: user.mobile }, JWT_SECRET, { expiresIn: "12h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN LOGOUT (simple)
router.post("/logout", adminAuth, async (req, res) => {
  try {
    tokenBlacklist.add(req.token);
    // Optionally schedule cleanup of expired tokens
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// PRODUCTS management

// Add product
router.post("/products", adminAuth, async (req, res) => {
  try {
    const data = req.body;
    // expected product fields - adapt to your Product schema
    // e.g. ProductName, ProductPrice, Category, Zodiac, Photos, Stock
    const product = new Product(data);
    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.error("Add product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit product
router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    console.error("Edit product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/admin/orders/:customOrderId/status", async (req, res) => {
  const { customOrderId } = req.params;
  const { orderStatus } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { customOrderId },
      { orderStatus },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
});
  
// List all products (with optional search)
router.get("/products", adminAuth, async (req, res) => {
  try {
    const q = req.query.q ? { $text: { $search: req.query.q } } : {};
    const products = await Product.find(q).limit(100);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// ORDERS & PAYMENT

// List orders (with optional filter)
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.paymentStatus) filter.status = req.query.paymentStatus; // e.g. CHARGED
    if (req.query.orderId) filter.customOrderId = req.query.orderId;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order with tracking
router.get("/orders/:orderId", adminAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ customOrderId: req.params.orderId }).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const tracking = await OrderTracking.findOne({ orderId: req.params.orderId });
    res.json({ order, tracking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ORDER STATUS SUMMARY (Delivered / Pending / Cancelled)
router.get("/stats/order-status-summary", adminAuth, async (req, res) => {
  try {
    const summary = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0
    };

    summary.forEach(item => {
      if (item._id === "Delivered") result.Delivered = item.count;
      if (item._id === "Pending") result.Pending = item.count;
      if (item._id === "Cancelled") result.Cancelled = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error("Order status summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/orders/:orderId/status", adminAuth, async (req, res) => {
try {
const { orderStatus } = req.body;


const order = await Order.findOneAndUpdate(
{ customOrderId: req.params.orderId },
{ orderStatus },
{ new: true }
);


if (!order) {
return res.status(404).json({ message: "Order not found" });
}


await OrderTracking.findOneAndUpdate(
{ orderId: req.params.orderId },
{
$set: { status: orderStatus },
$push: {
history: {
status: orderStatus,
note: `Updated to ${orderStatus}`,
updatedAt: new Date()
}
}
},
{ upsert: true, new: true }
);


res.json({
message: "Order status updated",
order
});
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error" });
}
});


// Update order payment status or add custom fields
// router.put("/orders/:orderId/status", adminAuth, async (req, res) => {
//   try {
//     const { paymentStatus, orderStatus, note } = req.body;

//     const order = await Order.findOneAndUpdate(
//       { customOrderId: req.params.orderId },
//       { 
//         ...(paymentStatus && { paymentStatus }),
//         ...(orderStatus && { orderStatus })
//       },
//       { new: true }
//     );

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     let tracking = null;
//     if (orderStatus) {
//       tracking = await OrderTracking.findOneAndUpdate(
//         { orderId: req.params.orderId },
//         {
//           $set: { status: orderStatus },
//           $push: {
//             history: {
//               status: orderStatus,
//               note: note || `Updated to ${orderStatus}`,
//               updatedAt: new Date()
//             }
//           }
//         },
//         { new: true, upsert: true }
//       );
//     }

//     res.json({
//       message: "Order updated successfully",
//       order,
//       tracking
//     });

//   } catch (err) {
//     console.error("Update order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// ---------------------
// USERS
// List users (paginated)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const page = Math.max(0, parseInt(req.query.page || "0"));
    const perPage = Math.min(100, parseInt(req.query.perPage || "50"));
    const users = await Admin.find({}).skip(page * perPage).limit(perPage).select("-password");
    const total = await Admin.countDocuments();
    res.json({ total, page, perPage, users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user
router.get("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await Admin.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// STATS for dashboard
// Note: sales computed from orders where status === 'CHARGED' (paid). Adjust if you use different status codes.

// Total sales (sum of totalAmount for paid orders)
router.get("/stats/total-sales", adminAuth, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: { $in: ["CHARGED", "PENDING", "PENDING".toUpperCase()] } } }, 
      // adjust match if you want only CHARGED
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
    ]);
    const data = result[0] || { totalSales: 0, count: 0 };
    res.json({ totalSales: data.totalSales, ordersCount: data.count });
  } catch (err) {
    console.error("Total sales stat:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Average sale amount (for CHARGED orders)
router.get("/stats/average-sale", adminAuth, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "CHARGED" } },
      { $group: { _id: null, avgSale: { $avg: "$totalAmount" }, count: { $sum: 1 } } }
    ]);
    const data = result[0] || { avgSale: 0, count: 0 };
    res.json({ avgSale: data.avgSale || 0, ordersCount: data.count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Weekly sales (last 6 weeks)
router.get("/stats/weekly-sales", adminAuth, async (req, res) => {
  try {
    const weeks = await Order.aggregate([
      { $match: { status: "CHARGED" } },
      {
        $group: {
          _id: { year: { $isoWeekYear: "$createdAt" }, week: { $isoWeek: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } },
      { $limit: 12 }
    ]);
    res.json(weeks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Monthly sales (last 12 months)
router.get("/stats/monthly-sales", adminAuth, async (req, res) => {
  try {
    const months = await Order.aggregate([
      { $match: { status: "CHARGED" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);
    res.json(months);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Best selling products (top N)
router.get("/stats/best-products", adminAuth, async (req, res) => {
  try {
    const topN = Math.min(50, parseInt(req.query.top || "10"));
    const best = await Order.aggregate([
      { $unwind: "$items" },
      // consider only paid orders
      { $match: { "status": "CHARGED" } },
      {
        $group: {
          _id: "$items.productId",
          totalQty: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.quantity", "$items.priceAtBuy"] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: topN },
      {
        $lookup: {
          from: Product.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: "$_id",
          totalQty: 1,
          totalSales: 1,
          productName: "$product.ProductName",
          productPrice: "$product.ProductPrice"
        }
      }
    ]);
    res.json(best);
  } catch (err) {
    console.error("Best products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
