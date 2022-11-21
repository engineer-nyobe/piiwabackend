const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reciever: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  sendertransactiontype: {
    type: String,
    default: "withdraw",
  },
  recievertransactiontype: {
    type: String,
    default: "deposit",
  },
  createat: {
    Type: Date,
    default: new Date(),
    timestamp: true,
  },
  statustransaction: String,
  transactioncode: String,
});

exports.Transaction = mongoose.model("Transaction", transactionSchema);
