const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const {
  GetWebUsers,
  DeleteteWebUser,
  GetWebUserById,
  CreateWebUser,
  CountWebUser,
  UpdateWebUser,
  WebSignIn,
  webUdateUserData,
  GetAllSPM,
  GetSpmById,
} = require("../controller/webuser");
const router = express.Router();

//user creation
router.post("/", CreateWebUser);

//get all users
router.get("/", GetWebUsers);

//get all spm
router.get("/spm", GetAllSPM);

//sign in
router.post("/signin", WebSignIn);

//count users
router.get("/number", CountWebUser);

//updating user
router.get("/updating/:id", webUdateUserData);

//get spm by id
router.get("/spm/:id", GetSpmById);

//get user by id
router.get("/:id", GetWebUserById);

// user delete
router.delete("/:id", DeleteteWebUser);

//update user
router.put("/:id", UpdateWebUser);

module.exports = router;
