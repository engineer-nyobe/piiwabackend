const { User } = require("../models/user");
const { Locality } = require("../models/locality");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

//create user
const signUp = async (req, res) => {
  const {
    username,
    localname,
    phone,
    password,
    role,
    usercompany,
    usernic,
    userimg,
  } = req.body;
  let dataCode = {
    username: username,
    userphone: phone,
    userrole: role,
  };
  let stJson = JSON.stringify(dataCode);
  let toStringBase;
  try {
    const olduser = await User.findOne({ phone });
    const oldlocality = await Locality.findOne({ localname });

    if (olduser) {
      return res.status(400).json({ message: "user already exist" });
    } else if (!oldlocality) {
      return res.status(400).json({ message: "the structure does not exist" });
    }
    try {
      toStringBase = await QRCode.toDataURL(stJson);
      console.log(toStringBase);
    } catch (error) {
      console.log(error);
    }
    const result = await User.create({
      username: username,
      phone,
      role,
      company: usercompany,
      userniccard: usernic,
      singleuserimage: userimg,
      password: bcrypt.hashSync(password, 12),
      locality: oldlocality._id,
      userqrcode: toStringBase,
    });
    oldlocality.users.push(result);
    oldlocality.save();
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        phone: result.phone,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "the user is not created" });
    console.log(error);
  }
};

//get all users
const getUser = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//login user
const signIn = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const secret = process.env.SECRET;
    const userExist = await User.findOne({ phone })
      .populate("Locality")
      .populate("deposits");
    if (!userExist)
      return res.status(404).json({
        message: "this user does not exist check the username and password",
      });
    else if (userExist && bcrypt.compareSync(password, userExist.password)) {
      const token = jwt.sign(
        {
          userId: userExist._id,
        },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).send({ userExist, token });
    } else {
      res.status(400).send("password is wrong");
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//get users by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//count users into the database
const CountAllUsers = async (req, res) => {
  try {
    const user = await User.find().count();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


module.exports = {
  signIn,
  signUp,
  getUser,
  getUserById,
  CountAllUsers,
};
