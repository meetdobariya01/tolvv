  // // models/Order.js
  // const mongoose = require("mongoose");

  // const orderSchema = new mongoose.Schema({
  //   customOrderId: { type: String, required: true, unique: true },
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //   items: [
  //     {
  //       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  //       quantity: { type: Number, required: true },
  //       priceAtBuy: { type: Number, required: true }
  //     }
  //   ],
  //   subtotal: { type: Number },
  //   cgst: { type: Number },
  //   sgst: { type: Number },
  //   totalAmount: { type: Number, required: true },
  //   paymentMethod: { type: String, default: "upi" }, // card, upi, cod
  //   status: { type: String, default: "Pending" },   // Pending, CHARGED, FAILED
  //   hdfcResponse: { type: Object },

  //   // raw response from HDFC
  //   address: {
  //     houseNumber: String,
  //     buildingName: String,
  //     societyName: String,
  //     road: String,
  //     landmark: String,
  //     city: String,
  //     pincode: String
  //   },
  //   createdAt: { type: Date, default: Date.now },
  //   updatedAt: { type: Date, default: Date.now }
  // });

  // // auto-update updatedAt
  // orderSchema.pre("save", function (next) {
  //   this.updatedAt = Date.now();
  //   next();
  // });

  // module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customOrderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      productName: {
        type: String, // ✅ ADD THIS
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      priceAtBuy: {
        type: Number,
        required: true
      }
    }
  ],

  subtotal: Number,
  cgst: Number,
  sgst: Number,
  totalAmount: { type: Number, required: true },

  paymentMethod: { type: String, default: "upi" },
  status: { type: String, default: "Pending" },

  hdfcResponse: Object,

  address: {
    houseNumber: String,
    buildingName: String,
    societyName: String,
    road: String,
    landmark: String,
    city: String,
    pincode: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
