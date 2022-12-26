const { Account } = require("../models/account");
const { User } = require("../models/user");

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

const GetAllAccounts = async (req, res) => {
  const accountData = await Account.find();
  res.status(200).json(accountData);
};

const UpdateAmountAccount = async (req, res) => {
  const {id} = req.params;
  const { amount } = req.body;
  const accountReceiver = await Account.findById(id);

  const coins = accountReceiver.amount + amount;
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
    .populate("transactions")
    .populate("sessions")
    .populate("owner");
  res.send(accountData);
};

module.exports = {
  CreateAccount,
  GetAllAccounts,
  UpdateAmountAccount,
  UpdateTypeAccount,
  GetAccountById,
};
