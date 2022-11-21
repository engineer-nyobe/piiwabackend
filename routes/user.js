const express = require("express");
const { signIn, signUp, getUser, getUserById, CountAllUsers } = require("../controller/user");

const router = express.Router();

router.get("/",getUser);
router.get("/number",CountAllUsers);
router.get("/:id",getUserById);
router.post("/login", signIn);
router.post("/", signUp);

module.exports = router;
