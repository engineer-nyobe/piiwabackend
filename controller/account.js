const { Account } = require("../models/account");
const { Spaccount } = require("../models/spaccount");
const { User } = require("../models/user");
const {ServicePoint} = require("../models/servicepoint")

const CreateAccount = async (req, res) => {
  const { owner } = req.body;
  const account = new Account({
    owner,
  });
  const createAccount = await account.save();

  if (!createAccount) {
    return res.status(500).json({
      massage: "account is not created",
    });
  } else {
    const user = await User.findByIdAndUpdate(
      owner,
      {
        account: createAccount._id,
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "user error creationfailed" });
    }
    return res.status(201).json(createAccount);
  }
};
const CreateSpaccount = async (req, res) => {
  const { servicepoint } = req.body;
  const account = new Spaccount({
    servicepoint,
  });
  const createAccount = await account.save();

  if (!createAccount) {
    return res.status(500).json({
      massage: "account is not created",
    });
  } else {
    const serv = await ServicePoint.findByIdAndUpdate(
      servicepoint,
      {
        account: createAccount._id,
      },
      { new: true }
    );
    if (!serv) {
      return res.status(400).json({ message: "user error creationfailed" });
    }
    return res.status(201).json(createAccount);
  }
};

const GetAllAccounts = async (req, res) => {
  const accountData = await Account.find();
  res.status(200).json(accountData);
};

const UpdateAmountAccount = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const accountReceiver = await Account.findById(id);

  const amountsend = parseInt(amount);

  const coins = accountReceiver.amount + amountsend;
  const data = await Account.findByIdAndUpdate(
    id,
    { amount: coins },
    { new: true }
  );
  if (!data) {
    return res.status(400).json({ message: "this account is not updated" });
  } else {
    return res.status(200).json(data);
  }
};
const UpdateTypeAccount = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const data = await Account.findByIdAndUpdate(
    id,
    { accounttype: type },
    { new: true }
  );
  if (!data) {
    return res.status(400).json({ message: "this account is not updated" });
  } else {
    return res.status(200).json(data);
  }
};

const GetAccountById = async (req, res) => {
  const { id } = req.params;
  const accountData = await Account.findById(id)
    .populate({
      path: "transactions",
      populate: {
        path: "sender",
        select: { owner: 1 },
        populate: {
          path: "owner",
          select: { phone: 1 },
        },
      },
    })
    .populate({
      path: "transactions",
      populate: {
        path: "receiver",
        select: { owner: 1 },
        populate: {
          path: "owner",
          select: { phone: 1 },
        },
      },
    })
    .populate("sessions")
    .populate({
      path: "owner",
      select: { password: 0, account:0},
    });
  res.send(accountData);
};

module.exports = {
  CreateAccount,
  GetAllAccounts,
  CreateSpaccount,
  UpdateAmountAccount,
  UpdateTypeAccount,
  GetAccountById,
};
