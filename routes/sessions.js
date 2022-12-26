const express = require("express");
//const { ServicePoint } = require("../models/servicepoint");
const router = express.Router();
const { Session } = require("../models/sessions");
const { User } = require("../models/user");
const { Account } = require("../models/account");

//create session
router.post("/", async (req, res) => {
  const { start, end, servicepoint, manager } = req.body;

  const servicepointCouncerned = await Account.findById(servicepoint);
  const managerCouncerned = await User.findById(manager);

  const session = new Session({
    start,
    end,
    servicepoint,
    manager,
  });
  const data = await session.save();
  servicepointCouncerned.sessions.push(data);
  servicepointCouncerned.save();
  managerCouncerned.sessions.push(data);
  managerCouncerned.save();
  if (!data) {
    return res.status(404).json({ message: "session is not created" });
  } else {
    return res.status(201).json(data);
  }
});

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
    .populate("servicepoint")
    .populate("manager");
  res.send(accountData);
});

module.exports = router;
