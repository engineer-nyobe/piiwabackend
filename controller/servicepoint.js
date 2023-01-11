const { Account } = require("../models/account");
const { Spaccount } = require("../models/spaccount");
const { ServicePoint } = require("../models/servicepoint");

const CreateServicepoint = async (req, res) => {
  const { phone, name, latitude, longitude } = req.body;

  const servicepoint = new ServicePoint({
    name,
    phone,
    latitude,
    longitude,
  });
  const service = await servicepoint.save();
  if (!service) {
    return res.status(500).json({
      massage: "service point is not created",
    });
  } else {
    const account = new Spaccount({
      servicepoint: service._id,
    });
    const accountcreation = await account.save();
    if (!accountcreation) {
      return res.status(500).json({
        massage: "service point account is not created",
      });
    } else {
      const updateservicepoint = await ServicePoint.findByIdAndUpdate(
        service._id,
        {
          account: accountcreation._id,
        },
        { new: true }
      );
      if (!updateservicepoint) {
        return res
          .status(400)
          .json({ message: "service point Updating failed " });
      }
      return res.status(201).json(service);
    }
  }
};

const GetAllservicespoints = async (req, res) => {
  const data = await ServicePoint.find();
  if (!data) {
    return res.status(404).json({ message: "can not get any service point" });
  } else {
    return res.status(200).json(data);
  }
};

const GetServicepointByid = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await ServicePoint.findById(id)
      .populate({
        path: "account",
        select: { servicepoint: 0 },
        populate: {
          path: "sessions",
          select: { servicepoint: 0 },
          populate: {
            path: "manager",
            select: { phone: 1 },
          },
        },
      })
      .populate({
        path: "account",
        select: { servicepoint: 0, owner: 0 },
        populate: {
          path: "sessions",
          select: { servicepoint: 0 },
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
        },
      })
      .populate({
        path: "account",
        select: { servicepoint: 0, owner: 0 },
        populate: {
          path: "sessions",
          select: { servicepoint: 0 },
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
        },
      });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "can not get this servicepoint" });
  }
};

const UpdateSpAccount = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const accountReceiver = await Spaccount.findById(id);

  const amountsend = parseInt(amount);

  const coins = accountReceiver.amount + amountsend;
  const data = await Spaccount.findByIdAndUpdate(
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

module.exports = {
  CreateServicepoint,
  GetAllservicespoints,
  GetServicepointByid,
  UpdateSpAccount,
};
