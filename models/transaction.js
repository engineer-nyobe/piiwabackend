const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  amount: {
    type: Number,
    default: 0,
  },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  servicepoint: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePoint" },
  createdat: {
    type: Date,
    default: new Date(),
  },
  operationtype: {
    type: String,
    default: null,
  },
});

exports.Transaction = mongoose.model("Transaction", transactionSchema);

/*
const transactionSchema = mongoose.Schema({
  senderid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recieverid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount:{
    type:Number,
    default:0
  },
  transactiontype:{
    type:String,
    default:null,
  },
  createdat:{
    type: Date,
    default: new Date()
  }
});

exports.Transact = mongoose.Schema("Transact",transactionSchema);

*/