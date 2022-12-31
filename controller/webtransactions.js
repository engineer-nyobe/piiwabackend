const { Transaction } = require("../models/transaction");
const { Account } = require("../models/account");
const { Session } = require("../models/sessions");
const { User } = require("../models/user");

const CreateTransaction = async (req, res) => {
  const { phoneSender, phoneReceiver, amount, spId } = req.body;
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
  } else if (phoneSender && amount && spId) {
    //transaction which spm is the receiver
    try {
      const sender = await GetAccountByPhone(phoneSender);
      if (!sender) {
        return res.status(404).json({ message: "can not get sender account" });
      }
      const _senderAccount = await Account.findById(sender);
      const _receiverAccount = await Account.findById(spId);

      const senderBalance_ = _senderAccount.amount - amount;
      const receiverBalance_ = _receiverAccount.amount + amount;

      const sessionExist = await Session.findOne({
        $and: [{ servicepoint: _receiverAccount._id }, { end: null }],
      });
      if (sessionExist) {
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
          servicepoint: spId,
          amount: amount,
          operationtype: "deposit",
        });
        const data = await transaction.save();
        _senderAccount.transactions.push(data);
        _senderAccount.save();
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
  } else if (phoneReceiver && amount && spId) {
    //transaction which spm is the sender
    try {
      const receiver = await GetAccountByPhone(phoneReceiver);
      if (!receiver) {
        return res.status(404).json({ message: "can not get sender account" });
      }
      const _senderAccount = await Account.findById(spId);
      const _receiverAccount = await Account.findById(receiver);

      const senderBalance_ = _senderAccount.amount - amount;
      const receiverBalance_ = _receiverAccount.amount + amount;

      const sessionExist = await Session.findOne({
        $and: [{ servicepoint: _senderAccount._id }, { end: null }],
      });
      if (sessionExist) {
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
            return res.send("error sender");
          }
        }

        const transaction = new Transaction({
          sender,
          servicepoint: spId,
          amount: amount,
          operationtype: "withdraw",
        });
        const data = await transaction.save();
        _senderAccount.transactions.push(data);
        _senderAccount.save();
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

const GetTransaction = async (req, res) => {
  const transactionData = await Transaction.find();
  res.send(transactionData);
};

const GetTransactionById = async (req, res) => {
  const {id} = req.params;
  const transactionData = await Transaction.findById(id);
  res.send(transactionData);
};

module.exports = {
  CreateTransaction,
  GetTransaction,
  GetTransactionById,
};
