const mongoose = require("mongoose");

const viewerSchema = mongoose.Schema({
  deposit: {
    type: Number,
    default: 0,
  },
  withdraw: {
    type: Number,
    default: 0,
  },
  transfer: {
    type: Number,
    default: 0,
  },
});

exports.Viewer = mongoose.model("Viewer",viewerSchema);