const mongoose = require('mongoose');

const localitySchema = mongoose.Schema({
  localname: String,
  position: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

exports.Locality = mongoose.model("Locality", localitySchema);