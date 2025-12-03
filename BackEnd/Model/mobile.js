const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true, match: /^[6-9]\d{9}$/ },
  Otp: { type: String },
  ExpirOtp: { type: Date },
  CtreatedA: { type: Date }
});

module.exports = mongoose.model('Phone', PhoneSchema);
