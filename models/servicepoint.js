const mongoose = require("mongoose");

const servicepointSchema = mongoose.Schema({
  name: {
    type: String,
    default: null,
  },

  latitude: { type: String, default: null },

  longitude: { type: String, default: null },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
});

exports.ServicePoint = mongoose.model("ServicePoint", servicepointSchema);
