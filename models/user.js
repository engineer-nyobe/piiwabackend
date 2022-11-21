const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  role: String,
  phone: {
    type: Number,
    require: true,
    maxLength: 9,
    minLength: 9,
    unique: true,
  },
  password: String,
  username: String,
  userposition: String,
  company: {
    type: String,
    default: "single",
  },
  userqrcode: {
    type: String,
    default: "none",
  },
  city: String,
  country: String,
  userniccard: String,
  singleuserimage: String,
  deposits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  withdraw: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  useraccount: { type: mongoose.Schema.Types.ObjectId, ref: "Accountuser" },
  locality: { type: mongoose.Schema.Types.ObjectId, ref: "Locality" },
});

exports.User = mongoose.model("User", userSchema);
