const express = require("express");
//const { ServicePoint } = require("../models/servicepoint");
const router = express.Router();
const { Session } = require("../models/sessions");
const { User } = require("../models/user");
const { Spaccount } = require("../models/spaccount");
const {CreateSession} = require("../controller/session")

//create session
router.post("/", CreateSession);

//get sessions
router.get("/", async (req, res) => {
  const data = await Session.find();
  if (!data) {
    return res.status(404).json({ message: "can not get sessions" });
  } else {
    return res.status(200).json(data);
  }
});

//close session
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { end } = req.body;
  const session = await Session.findByIdAndUpdate(id, { end }, { new: true });
  if (!session) {
    return res.status(400).send("you can't close this session");
  } else {
    return res.status(200).json(session);
  }
});

//get session by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const accountData = await Session.findById(id)
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
    });
  res.send(accountData);
});

module.exports = router;
