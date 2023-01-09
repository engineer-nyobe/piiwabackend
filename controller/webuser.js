const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "test";

//create user
const GetWebUsers = async (req, res) => {
  const usersdata = await User.find().select("-password");
  res.send(usersdata);
};

const DeleteteWebUser = async (req, res) => {
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

const GetWebUserById = async (req, res) => {
  const { id } = req.params;
  const usersdata = await User.findById(id)
    .populate({
      path: "account",
      select: { owner: 0 },
      populate: {
        path: "transactions",
        populate: {
          path: "sender",
          select: { owner: 1 },
          populate: {
            path: "owner",
            select: { phone: 1 },
          },
        },
      },
    })
    .populate({
      path: "account",
      select: { owner: 0 },
      populate: {
        path: "transactions",
        populate: {
          path: "receiver",
          select: { owner: 1 },
          populate: {
            path: "owner",
            select: { phone: 1 },
          },
        },
      },
    })
    .select("-password -code");
  res.send(usersdata);
};

const CreateWebUser = async (req, res) => {
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

const CountWebUser = async (req, res) => {
  const usersdata = await User.find().count();
  if (!usersdata) {
    return res.status(500).json({ message: "can not get number of users" });
  } else {
    return res.status(200).json(usersdata);
  }
};

const UpdateWebUser = async (req, res) => {
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

const WebSignIn = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const userExist = await User.findOne({ phone });
    if (!userExist) {
      return res.status(404).json({ message: "the user does not exist" });
    }
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
  } catch (error) {
    return res.status(500).json({
      message: "not login",
    });
  }
};

const webUdateUserData = async (req, res) => {
  const { id } = req.params;
  try {
    const usersdata = await User.findById(id).select("-password -sessions -code").populate({
      path: "account",
      select:{amount:1, accounttype:1}
    });
    return res.status(200).json(usersdata);
  } catch (error) {
    return res.status(404).json({ message: "this user does not exist" });
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

const GetSpmById = async (req, res) => {
  const { id } = req.params;
  const usersdata = await User.findById(id)
    .populate({
      path: "account",
      select: { owner: 0 },
      populate: {
        path: "transactions",
        populate: {
          path: "sender",
          select: { owner: 1 },
          populate: {
            path: "owner",
            select: { phone: 1 },
          },
        },
      },
    })
    .populate({
      path: "account",
      select: { owner: 0 },
      populate: {
        path: "transactions",
        populate: {
          path: "receiver",
          select: { owner: 1 },
          populate: {
            path: "owner",
            select: { phone: 1 },
          },
        },
      },
    })
    .populate({
      path: "sessions",
      populate: {
        path: "servicepoint",
        select: { sessions: 0, amount: 0, accounttype: 0 },
        populate: {
          path: "servicepoint",
          select: { name: 1 },
        },
      },
    })
    .populate({
      path: "sessions",
      select: { manager: 0 },
      populate: {
        path: "transactions",
        select: { servicepoint: 0 },
        populate: {
          path: "receiver",
          select: { owner :1},
          populate:{
            path:"owner",
            select:{phone:1}
          }
        },
      },
    })
    .populate({
      path: "sessions",
      select: { manager: 0 },
      populate: {
        path: "transactions",
        select: { servicepoint: 0 },
        populate: {
          path: "sender",
          select: { owner :1},
          populate:{
            path:"owner",
            select:{phone:1}
          }
        },
      },
    })
    .select("-password -code");
  return res.status(200).json(usersdata);
};

module.exports = {
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
};
