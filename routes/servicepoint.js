const express = require("express");
const { Account } = require("../models/account");
const router = express.Router();

const { ServicePoint } = require("../models/servicepoint");
const {
  CreateServicepoint,
  GetAllservicespoints,
  GetServicepointByid,
  UpdateSpAccount,
} = require("../controller/servicepoint");

//servicepoint creation
router.post("/", CreateServicepoint);

//servicepoint creation
router.put("/update/:id", UpdateSpAccount);

//get all servicepoint
router.get("/", GetAllservicespoints);

//get service point by id
router.get("/:id", GetServicepointByid);

module.exports = router;
