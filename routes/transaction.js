const express = require("express");
const {
  CreateTransaction,
  GetTransaction,
} = require("../controller/transsaction");

const router = express.Router();

router.post("/", CreateTransaction);

router.get("/", GetTransaction);

module.exports = router;
