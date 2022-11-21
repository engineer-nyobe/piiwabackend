const express = require("express");
const { createteLocality,getAllPlaces} = require("../controller/locality");

const router = express.Router();

router.get("/", getAllPlaces);
router.post("/", createteLocality);

module.exports = router;
