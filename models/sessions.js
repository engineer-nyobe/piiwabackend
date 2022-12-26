const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  start: {
    type: Date,
    default: new Date(),
  },
  end: {
    type: Date,
    default: null,
  },
  servicepoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  transactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", default: null },
  ],
});

exports.Session = mongoose.model("Session", sessionSchema);
