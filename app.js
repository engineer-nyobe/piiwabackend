const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require('./routes/user')
const localityRoute = require('./routes/locality');


const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json({limit:"30mb",extended:true}));
app.use(express.urlencoded({limit:"30mb",extended:true}));

require('./config/db')


app.use(bodyParser.json());
app.use(morgan("tiny"));


app.use("/users", userRouter);
app.use("/localities", localityRoute);

app.listen(process.env.PORT, () =>
  console.log(`the server on port ${process.env.PORT}`)
);
