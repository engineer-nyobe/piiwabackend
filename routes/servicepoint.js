const express = require("express");
const { Account } = require("../models/account");
const router = express.Router();

const { ServicePoint } = require("../models/servicepoint");
const {
  CreateServicepoint,
  GetAllservicespoints,
  GetServicepointByid,
} = require("../controller/servicepoint");

//servicepoint creation
router.post("/", CreateServicepoint);

//get all servicepoint
router.get("/", GetAllservicespoints);

//get service point by id
router.get("/:id", GetServicepointByid);

module.exports = router;
