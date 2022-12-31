const mongoose = require("mongoose");

const SpaccountSchema = mongoose.Schema({
  accounttype: {
    type: String,
    default: "servicepoint",
  },
  amount: {
    type: Number,
    default: 0,
  },
  servicepoint: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePoint" },
  sessions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
  ],
  createdat: {
    type: Date,
    default: new Date(),
  },
});

exports.Spaccount = mongoose.model("Spaccount", SpaccountSchema);
