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
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
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

//Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) { //  Use correct field name
    this.password = await bcrypt.hash(this.password, 6);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);