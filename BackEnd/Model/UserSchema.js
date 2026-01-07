const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: function () {
      return !this.googleAuth;
    },
    minlength: 6,
  },

  mobile: {
    type: String,
    unique: true,
    required: function () {
      return !this.googleAuth;
    },
  },

  googleAuth: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["admin", "user", "delivery"],
    default: "user",
  },

  addresses: [String],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
