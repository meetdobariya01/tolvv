const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,

  },
  role: {
    type: String,
    enum: ['admin', 'user', 'delivery'],
    default: 'user'
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  addresses: [String] 
});

module.exports = mongoose.model('User', UserSchema);