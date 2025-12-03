const mongoose = require("mongoose")

const orderTrackingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Add this line
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    product: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    address: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Order Placed", "Processing", "Out for Delivery", "Delivered", "Cancelled"], 
        default: "Order Placed" 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OrderTracking", orderTrackingSchema);