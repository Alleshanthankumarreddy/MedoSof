import medicineModel from "../models/medicineModel.js";
import rackModel from "../models/rackModel.js";

const addMedicine = async (req, res) => {
  try {
    const {
      medicineCode,
      tradeName,
      genericName,
      description,
      usageInstructions,
      rackNumber,
      unitPurchasePrice,
      unitSellingPrice,
    } = req.body;

    if (
      !medicineCode ||
      !tradeName ||
      !genericName ||
      !description ||
      !usageInstructions ||
      !rackNumber ||
      !unitPurchasePrice ||
      !unitSellingPrice
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all the details required" });
    }

    const rack = await rackModel.findOne({ rackNumber });
    if (!rack) {
      return res
        .status(400)
        .json({ success: false, message: "Provide the correct rackNumber" });
    }

    const checkMedicine = await medicineModel.findOne({ medicineCode });
    if (checkMedicine) {
      return res
        .status(400)
        .json({ success: false, message: "Medicine already exists" });
    }

    const newMedicine = await medicineModel.create({
      medicineCode,
      tradeName,
      genericName,
      description,
      usageInstructions,
      rackId: rack._id,
      unitPurchasePrice,
      unitSellingPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: newMedicine,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const ExpiredMedicines = (req, res) => {
  
};

const viewAllMedicines = (req, res) => {
  
};

export { addMedicine, viewAllMedicines };
