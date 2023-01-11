const { Session } = require("../models/sessions");
const { User } = require("../models/user");
const { Spaccount } = require("../models/spaccount");
const { ServicePoint } = require("../models/servicepoint");

const GetSpByName = async (name) => {
  const getSpAccount = await ServicePoint.findOne({ name }).select("account");
  if (!getSpAccount) {
    return console.log("the servicepoint does not exist");
  } else {
    return getSpAccount.account;
  }
};

const CreateSession = async (req, res) => {
  const { start, end, name, phone } = req.body;

  const servicepointAccountId = await GetSpByName(name);
  const managerCouncerned = await User.findOne({ phone });

  if (!servicepointAccountId) {
    return res.status(404).json({ message: "the servicepoint does not exist" });
  } else if (!managerCouncerned) {
    return res.status(404).json({ message: "this manager does not exist" });
  } else {
    const servicepointCouncerned = await Spaccount.findById(
      servicepointAccountId
    );
    const sessionExist = await Session.findOne({
      $and: [{ servicepoint: servicepointCouncerned._id }, { end: null }],
    });

    if (sessionExist) {
      return res.status(404).json({ message: "session already in running" });
    }
    //return res.status(200).json(servicepointCouncerned);
    const session = new Session({
      start,
      end,
      servicepoint: servicepointCouncerned._id,
      manager: managerCouncerned._id,
    });
    try {
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
    } catch (error) {
      return res.status(404).json({ message: "session is not created" });
    }
  }
};

module.exports = {
  CreateSession,
};
