const mongoose = require("mongoose");

const accountuserSchema = mongoose.Schema({
  accounttype: {
    type: String,
    default: "single",
  },
  walletcredit: {
    type: Number,
    default: 500,
  },
  owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

exports.Accountuser = mongoose.model("Accountuser", accountuserSchema);
