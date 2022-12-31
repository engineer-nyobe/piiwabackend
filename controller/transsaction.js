const { Transaction } = require("../models/transaction");
const { Account } = require("../models/account");
const { Spaccount } = require("../models/Spaccount");
const { Session } = require("../models/sessions");
const { User } = require("../models/user");

const CreateTransactionUserToUser = async (req, res) => {
  const { phoneSender, phoneReceiver, amount } = req.body;
  //user to user transaction
  if (phoneSender && phoneReceiver && amount) {
    try {
      const amountBalance = parseInt(amount);
      const sender = await GetAccountByPhone(phoneSender);
      const receiver = await GetAccountByPhone(phoneReceiver);
      if (!sender || !receiver) {
        return res.status(404).json({ message: "can not get sender account" });
      }
      const _senderAccount = await Account.findById(sender);
      const _receiverAccount = await Account.findById(receiver);
      const senderBalance_ = _senderAccount.amount - amountBalance;
      const receiverBalance_ = _receiverAccount.amount + amountBalance;
      if (senderBalance_ <= 0) {
        return res.status(404).json({ message: "sender account error" });
      } else {
        const receiverAccount = await Account.findByIdAndUpdate(receiver, {
          amount: receiverBalance_,
        });
        if (!receiverAccount) {
          return res.status(404).json({ message: "error receiver" });
        }
        const senderAccount = await Account.findByIdAndUpdate(sender, {
          amount: senderBalance_,
        });
        if (!senderAccount) {
          return res.status(404).json({ message: "error sender" });
        }
      }
      const transaction = new Transaction({
        sender,
        receiver,
        amount: amount,
        operationtype: "transfer",
      });
      const data = await transaction.save();
      _senderAccount.transactions.push(data);
      _senderAccount.save();
      _receiverAccount.transactions.push(data);
      _receiverAccount.save();

      if (!data) {
        return res.status(500).json({ message: "tansaction failed" });
      } else {
        return res.status(201).json(data);
      }
    } catch (error) {
      return res.status(404).json(error);
    }
  }
};

const GetAccountByPhone = async (phone) => {
  const getPhoneAccount = await User.findOne({ phone }).select("account");
  if (!getPhoneAccount) {
    return res.status(404).json({ message: "no user with this phone" });
  } else {
    return getPhoneAccount.account;
  }
};
const GetAccountByName = async (name) => {
  const getSpAccount = await Spaccount.findOne({ name });
  if (!getSpAccount) {
    return res.status(404).json({ message: "no sp with this name" });
  } else {
    return getSpAccount;
  }
};

const GetTransaction = async (req, res) => {
  const transactionData = await Transaction.find();
  res.send(transactionData);
};

const GetUsertoUserTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transactionData = await Transaction.findById(id);
    const sender = await Account.findById(transactionData.sender)
      .populate("owner", "phone")
      .select("owner");
    const receiver = await Account.findById(transactionData.receiver)
      .populate("owner", "phone")
      .select("owner");
    return res.status(200).json({ transactionData, sender, receiver });
  } catch (error) {
    return res.status(404).json({ message: "can not get this transaction" });
  }
};

const DepositTransaction = async (req, res) => {
  const { spname, amount, phoneReceiver } = req.body;
  //transaction which spm is the sender
  try {
    const amountBalance = parseInt(amount);
    const receiver = await GetAccountByPhone(phoneReceiver);
    if (!receiver) {
      return res.status(404).json({ message: "can not get sender account" });
    }

    const sender = await GetAccountByName(spname);
    if (!sender) {
      return res.status(404).json({ message: "can not get sender account" });
    }

    const _senderAccount = await Spaccount.findById(sender._id);
    const _receiverAccount = await Account.findById(receiver._id);

    const senderBalance_ = _senderAccount.amount - amountBalance;
    const receiverBalance_ = _receiverAccount.amount + amountBalance;

    const sessionExist = await Session.findOne({
      $and: [{ servicepoint: _senderAccount._id }, { end: null }],
    });
    if (sessionExist) {
      if (senderBalance_ <= 0) {
        return res.status(404).json({ message: "sender account error" });
      } else {
        const receiverAccount = await Account.findByIdAndUpdate(receiver._id, {
          amount: receiverBalance_,
        });
        if (!receiverAccount) {
          return res.status(404).json({ message: "error receiver" });
        }
        const senderAccount = await Spaccount.findByIdAndUpdate(sender._id, {
          amount: senderBalance_,
        });
        if (!senderAccount) {
          return res.status(404).json({ message: "error sender" });
        }
      }

      const transaction = new Transaction({
        receiver: receiver._id,
        servicepoint: sender._id,
        amount: amountBalance,
        operationtype: "deposit",
      });
      const data = await transaction.save();
      _receiverAccount.transactions.push(data);
      _receiverAccount.save();
      sessionExist.transactions.push(data);
      sessionExist.save();

      if (!data) {
        return res
          .status(500)
          .json({ success: false, message: "tansaction failed" });
      } else {
        return res.status(201).json(data);
      }
    } else {
      return res.status(404).json({ message: "the session does not exist" });
    }
  } catch (error) {
    return res.status(404).json(error);
  }
};

const withdrawtransaction = async(req,res)=>{
  const { spname, amount, phoneSender } = req.body;
  //transaction which spm is the receiver
  try {
    const amountBalance = parseInt(amount);
    const sender = await GetAccountByPhone(phoneSender);
    if (!sender) {
      return res.status(404).json({ message: "can not get sender account" });
    }

    const receiver = await GetAccountByName(spname);
    if (!sender) {
      return res.status(404).json({ message: "can not get sender account" });
    }

    const _senderAccount = await Account.findById(sender._id);
    const _receiverAccount = await Spaccount.findById(receiver._id);

    const senderBalance_ = _senderAccount.amount - amountBalance;
    const receiverBalance_ = _receiverAccount.amount + amountBalance;

    const sessionExist = await Session.findOne({
      $and: [{ servicepoint: _receiverAccount._id }, { end: null }],
    });
    if (sessionExist) {
      if (senderBalance_ <= 0) {
        return res.status(404).json({ message: "sender account error" });
      } else {
        const receiverAccount = await Spaccount.findByIdAndUpdate(receiver._id, {
          amount: receiverBalance_,
        });
        if (!receiverAccount) {
          return res.status(404).json({ message: "error receiver" });
        }
        const senderAccount = await Account.findByIdAndUpdate(sender._id, {
          amount: senderBalance_,
        });
        if (!senderAccount) {
          return res.status(404).json({ message: "error sender" });
        }
      }

      const transaction = new Transaction({
        sender: sender._id,
        servicepoint: receiver._id,
        amount: amountBalance,
        operationtype: "withdraw",
      });
      const data = await transaction.save();
      _senderAccount.transactions.push(data);
      _senderAccount.save();
      sessionExist.transactions.push(data);
      sessionExist.save();

      if (!data) {
        return res
          .status(500)
          .json({ success: false, message: "tansaction failed" });
      } else {
        return res.status(201).json(data);
      }
    } else {
      return res.status(404).json({ message: "the session does not exist" });
    }
  } catch (error) {
    return res.status(404).json(error);
  }
}

module.exports = {
  CreateTransactionUserToUser,
  GetTransaction,
  withdrawtransaction,
  GetUsertoUserTransactionById,
  DepositTransaction,
};
