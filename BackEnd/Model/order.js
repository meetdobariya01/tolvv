
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customOrderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  customerName: { type: String, required: true },  // ✅ Store name
  customerEmail: { type: String, required: true }, // ✅ Store email

 items: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    hamperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hamper"
    },

    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceAtBuy: { type: Number, required: true },

    // ✅ ADD THIS
    hamperItems: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number
      }
    ]
  }
],

  subtotal: { type: Number },
  cgst: { type: Number },
  sgst: { type: Number },
  totalAmount: { type: Number, required: true },

  paymentMethod: { type: String, default: "upi" }, // upi, card, cod
  status: { type: String, default: "Pending" },    // Pending, CHARGED, FAILED

  hdfcResponse: { type: Object },

  address: {
    houseNumber: String,
    buildingName: String,
    societyName: String,
    road: String,
    landmark: String,
    city: String,
    pincode: String,
    mobile: String
  },

  note: { type: String, default: "" }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
