const express = require("express");
const { Account } = require("../models/account");
const router = express.Router();

const { ServicePoint } = require("../models/servicepoint");

//servicepoint creation
router.post("/", async (req, res) => {
  const { name, latitude, longitude } = req.body;

  const servicepoint = new ServicePoint({
    name,
    latitude,
    longitude,
  });
  const service = await servicepoint.save();
  if (!service) {
    return res.status(500).json({
      massage: "service point is not created",
    });
  } else {
    const account = new Account({
      owner: service._id,
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
        return res.status(400).send("service point Updated failed ");
      }
      return res.status(201).json(service);
    }
  }
});

//get all servicepoint
router.get("/", async (req, res) => {
  const data = await ServicePoint.find();
  if (!data) {
    return res.status(404).json({ message: "can not get any service point" });
  } else {
    return res.status(200).json(data);
  }
});

//get service point by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await ServicePoint.findById(id)
    .populate("account");
  if (!data) {
    return res.status(404).json({ message: "can not get this servicepoint" });
  } else {
    return res.status(200).json(data);
  }
});

module.exports = router;
