const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  accounttype: {
    type: String,
    default: "simple",
  },
  amount: {
    type: Number,
    default: 0,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
  ],
  createdat: {
    type: Date,
    default: new Date(),
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  ],
});

exports.Account = mongoose.model("Account", accountSchema);
