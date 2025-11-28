// models/order.tracking.js
const mongoose = require("mongoose");

const orderTrackingSchema = new mongoose.Schema({
  orderId: { type: String, required: true },

  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "OutForDelivery", "Delivered", "Cancelled"],
    default: "Pending"
  },

  history: [
    {
      status: String,
      note: String,
      updatedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("OrderTracking", orderTrackingSchema);
