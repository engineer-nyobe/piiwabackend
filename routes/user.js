const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const {
  GetUsers,
  DeleteteUser,
  GetUserById,
  CreateUser,
  CountUser,
  UpdateUser,
  SignIn,
  GetAllSPM
} = require("../controller/user");
const router = express.Router();

//user creation
router.post("/", CreateUser);

//get all users
router.get("/", GetUsers);

//get all spm
router.get("/spm", GetAllSPM);

//sign in
router.post("/signin", SignIn);

//count users
router.get("/number", CountUser);

//get user by id
router.get("/:id", GetUserById);

// user delete
router.delete("/:id", DeleteteUser);

//update user
router.put("/:id", UpdateUser);

module.exports = router;