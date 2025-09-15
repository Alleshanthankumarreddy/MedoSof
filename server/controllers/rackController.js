import rackModel from "../models/rackModel.js";

const addRack = async (req, res) => {
  try {
    const { rackNumber, locationDescription } = req.body;

    if (!rackNumber || !locationDescription) {
      return res.status(400).json({ success: false, message: "Missing rack credentials" });
    }

    const rack = await rackModel.findOne({ rackNumber });

    if (rack) {
      return res.status(400).json({ success: false, message: "Rack number already exists" });
    }

    const newRack = await rackModel.create({
      rackNumber,
      locationDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully added the rack",
      rack: newRack,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export { addRack };
