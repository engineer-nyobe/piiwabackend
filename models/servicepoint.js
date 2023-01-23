const mongoose = require("mongoose");

const servicepointSchema = mongoose.Schema({
  phone: {
    type: Number,
    default: null,
    unique: true,
  },
  passwordsp: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
    unique: true,
  },

  latitude: { type: String, default: null },

  longitude: { type: String, default: null },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spaccount",
    default: null,
  },
});

exports.ServicePoint = mongoose.model("ServicePoint", servicepointSchema);
