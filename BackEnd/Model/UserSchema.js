const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fname: {
    type: String
  },

  lname: {
    type: String
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile: {
    type: String
  },

  password: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model("User", userSchema);