const express = require("express");
const {
  CreateTransactionUserToUser,
  GetTransaction,
  DepositTransaction,
  withdrawtransaction,
  GetUsertoUserTransactionById,
} = require("../controller/transsaction");

const router = express.Router();

router.post("/", CreateTransactionUserToUser);
router.post("/deposit", DepositTransaction);
router.post("/withdraw", withdrawtransaction);
router.get("/", GetTransaction);
router.get("/:id", GetUsertoUserTransactionById);

module.exports = router;
