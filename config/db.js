const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "piiwa",
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("connection error ", err);
  });
