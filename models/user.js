const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  phone: {
    type: Number,
    default: null,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  code: {
    type: String,
    default: null,
  },
  usertype: {
    type: String,
    default: "SIMPLE",
  },
  createdat: {
    type: Date,
    default: new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    default: null,
  }],
  username: {
    type: String,
    default: null,
  },
  usernic: {
    type: String,
    default: null,
  },
});

exports.User = mongoose.model("User", userSchema);
