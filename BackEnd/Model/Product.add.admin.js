const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  ProductPrice: { type: Number, required: true },
  Category: { type: String },
  Zodiac: { type: String }, // optional if used
  Description: { type: String },
  Image: { type: String },
  size: {type:String}
});

module.exports = mongoose.model('Product', ProductSchema);
