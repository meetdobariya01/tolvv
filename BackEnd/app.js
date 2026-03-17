require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
require("./db/conn");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/images", express.static("D:\\Job\\Telve\\tolvv\\public\\images"));

// Import Routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const userRoutes = require("./routes/user.routes");

const hamperRoutes = require("./routes/hamper.routers");
const invoiceRoutes = require("./routes/invoice.routes");
const connectRoute = require("./routes/connect");
// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hamper", hamperRoutes);
app.use("/api/connect", connectRoute);
app.use("/api", invoiceRoutes);
// Start server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});