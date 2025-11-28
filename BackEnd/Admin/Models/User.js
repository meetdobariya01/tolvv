const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user', 'delivery'], default: 'user' },
  mobile: { type: String, required: true, unique: true },
  email: { type: String }, // optional but needed for payment
  addresses: [String] // optional multiple addresses
});

module.exports = mongoose.model('User', UserSchema);
