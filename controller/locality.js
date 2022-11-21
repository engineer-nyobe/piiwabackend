const { Locality } = require("../models/locality");

//locality creation
const createteLocality = async (req, res) => {
  const { localname, position } = req.body;
  try {
    const oldlocal = await Locality.findOne({ localname });
    if (oldlocal) {
      return res
        .status(400)
        .json({ message: "ths locality exist into the database" });
    } else {
      const result = await Locality.create({
        localname,
        position,
      });
      res.status(201).json({ result });
    }
  } catch (error) {
    res.status(500).json({ message: "the place is not created" });
    console.log(error);
  }
};

//get localities
const getAllPlaces = async (req, res) => {
  try {
    const places = await Locality.find().populate("users");
    res.status(200).json(places);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createteLocality,
  getAllPlaces,
};
