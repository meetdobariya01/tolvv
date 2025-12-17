require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const adminRoutes = require('./Router/Admin');
const path = require('path');
const Order = require("../Admin/Models/Order");
const puppeteer = require("puppeteer");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ THIS IS THE ONLY IMAGE CONFIG YOU NEED

app.use('/images', express.static(path.join(__dirname,'../../public/images')));

// Middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','http://localhost:3002'],
  credentials: true
}));

// JWT
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    } catch (err) {}
  }
  next();
});

// Routes
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Backend Running" });
});

app.get("/invoice/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ customOrderId: req.params.orderId })
      .populate("items.productId");

    if (!order) return res.status(404).send("Order not found");

    // HTML TEMPLATE
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial; padding: 40px; }
        h1 { color: #c9a14a; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border-bottom: 1px solid #ddd; padding: 10px; }
      </style>
    </head>
    <body>
      <h1>INVOICE</h1>
      <p><b>Order ID:</b> ${order.customOrderId}</p>
      <p><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString()}</p>

      <h3>Customer</h3>
      <p>${order.address?.buildingName || "Guest"}</p>
      <p>${order.address?.city} - ${order.address?.pincode}</p>

      <h3>Items</h3>
      <table>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${order.items.map(item => `
          <tr>
            <td>${item.productId?.ProductName}</td>
            <td>${item.quantity}</td>
            <td>₹${item.priceAtBuy}</td>
            <td>₹${item.quantity * item.priceAtBuy}</td>
          </tr>
        `).join("")}
      </table>

      <h3>Total: ₹${order.totalAmount}</h3>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${order.customOrderId}.pdf`
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate invoice");
  }
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("✔ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
