const mongoose = require("mongoose");

const hamperSchema = new mongoose.Schema({

  zodiacs: [
    {
      type: String,
      required: true
    }
  ],

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Hamper", hamperSchema);