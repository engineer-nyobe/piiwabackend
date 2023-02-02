const { User } = require("../models/user");
const { Account } = require("../models/account");
const { ServicePoint } = require("../models/servicepoint");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "test";

//create user
const GetUsers = async (req, res) => {
  const usersdata = await User.find().select("-password");
  res.send(usersdata);
};

const DeleteteUser = async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({ message: "user deleted" });
      } else {
        return res.status(404).json({ message: "category does not deleted" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

const GetUserById = async (req, res) => {
  const { id } = req.params;
  const usersdata = await User.findById(id)
    .populate("account")
    .select("-password");
  res.send(usersdata);
};

const CreateUser = async (req, res) => {
  const { phone, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    phone,
    password: hashedPassword,
  });
  user
    .save()
    .then((createUser) => {
      res.status(201).json(createUser);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "this user already exist",
      });
    });
};

const serialNumber = () => {
  const digits =
    "0123456789";
  let serial = "";
  for (let i = 0; i < 5; i++) {
    let rand = Math.floor(Math.random() * digits.length);
    serial += digits[rand];
  }
  return serial;
};

const UserCodeValidation = async (req, res) => {
  const { code } = req.body;
  const UserExist = await User.findOne({ code });
  if (!UserExist) {
    return res.status(500).json({ message: "code error try again" });
  }
  const AccountCreation = new Account({
    owner: UserExist._id,
  });
  const AccountCreated = await AccountCreation.save();
  if (AccountCreated) {
    const usercreated = await User.findByIdAndUpdate(
      UserExist._id,
      {
        account: AccountCreated._id,
      },
      { new: true }
    );
    const token = jwt.sign({ id: UserExist._id }, secret, {
      expiresIn: "1h",
    });
    return res.status(201).json({ userExist: usercreated, token });
  } else {
    return res.status(500).json({ message: "can not create an account" });
  }
};

const UserMobileCreation = async (req, res) => {
  const { phone, password } = req.body;
  const UserExist = await User.findOne({ phone });
  if (UserExist) {
    return res.status(500).json({ message: "the user already  exist" });
  }
  const serial = serialNumber();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const UserCreation = new User({
    phone,
    password: hashedPassword,
    code: serial,
  });
  const userCreated = await UserCreation.save();
  if (userCreated) {
    return res.status(201).json(serial);
  } else {
    return res.status(500).json({ message: "can not create this user" });
  }
};

const CountUser = async (req, res) => {
  const usersdata = await User.find().count();
  if (!usersdata) {
    return res.status(500).json({ message: "can not get number of users" });
  } else {
    return res.status(200).json(usersdata);
  }
};

const UpdateUser = async (req, res) => {
  const { phone, password, code, usertype, username, usernic } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      phone,
      password: hashedPassword,
      usertype,
      code,
      username,
      usernic,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ message: "the user is not updated" });
  } else {
    return res.status(201).json(user);
  }
};

const SignIn = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const userExist = await User.findOne({ phone });
    const spExist = await ServicePoint.findOne({ phone });
    if (!userExist && !spExist) {
      return res.status(404).json({ message: "the user does not exist" });
    } else if (userExist && !spExist) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "invalid credentials" });
      }
      const token = jwt.sign(
        { phone: userExist.phone, id: userExist._id },
        secret,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ userExist, token });
    } else if (!userExist && spExist) {
      if (spExist.name === password) {
        const token = jwt.sign(
          { phone: spExist.phone, id: spExist._id },
          secret,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ spExist, token });
      } else {
        return res.status(400).json({ message: "invalid sp" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "not login",
    });
  }
};

const GetAllSPM = async (req, res) => {
  try {
    const usersdata = await User.find({ usertype: "SPM" }).select("-password");
    if (!usersdata) {
      return res.status(400).json({ message: "no spm exist" });
    } else {
      return res.status(200).json(usersdata);
    }
  } catch (error) {
    return res.status(404).json({ message: " can not get spm " + error });
  }
};

module.exports = {
  GetUsers,
  DeleteteUser,
  GetUserById,
  CreateUser,
  CountUser,
  UpdateUser,
  SignIn,
  GetAllSPM,
  UserMobileCreation,
  UserCodeValidation,
};
