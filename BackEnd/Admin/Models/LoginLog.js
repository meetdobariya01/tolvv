const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId },
role: { type: String, enum: ["admin", "user"] },
ipAddress: String,
loginTime: { type: Date, default: Date.now }
});


module.exports = mongoose.model("LoginLog", loginLogSchema);