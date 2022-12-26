const express = require("express");
const { CountUser } = require("../controller/user");

const router = express.Router();

router.get("/user", CountUser);

module.exports = router;