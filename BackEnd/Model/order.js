// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true }
    }
  ],
  subtotal: Number,
  sgst: Number,
  cgst: Number,
  other: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  address: {
    houseNumber: String,
    buildingName: String,
    societyName: String,
    road: String,
    landmark: String,
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  status: {
    type: String,
    default: 'Pending' // Possible: Pending, Preparing, Delivered, etc.
  },
  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  currentLocation: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
