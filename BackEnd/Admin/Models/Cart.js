const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cartSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
items: [{
productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
quantity: Number
}]
}, { timestamps: true });


module.exports = mongoose.model("Cart", cartSchema);