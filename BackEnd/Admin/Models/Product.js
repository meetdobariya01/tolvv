const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  ProductPrice: { type: Number, required: true },
  Category: { type: String },
  Zodiac: { type: String }, // optional if used
  Description: { type: String },
  Photos: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);
  