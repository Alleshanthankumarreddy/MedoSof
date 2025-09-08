import medicineBatchModel from "../models/medicineBatchModel.js";
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

const ExpiredMedicines = async (req, res) => {
    try {
        const expiredBatches = await medicineBatchModel
        .find({ expiryDate: { $lt: new Date() } })
        .populate("medicineId", "medicineCode")
        .lean();

         const expiredTablets = expiredBatches.map(batch => {
            if (batch.medicineId) {
                return {
                batchNumber: batch.batchNumber,
                medicineCode: batch.medicineId.medicineCode
                };
            }
            return null;
        })
        .filter(Boolean);
      
        return res.json({success : true, expiredTablets });
      
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success : false,error: error.message });
    }
  };
  

const viewAllMedicines = async (req, res) => {

    try{
        const medicines = await medicineModel.find().lean();

        const medicinesArray = [...medicines];

        return res.json({ success : true, medicines: medicinesArray });
    } catch(error) {

        console.error(err);
        return res.status(500).json({ success : false, error: error.message});
    }
};

const deleteMedicine = async (req,res) => {
    const { medicineCode } = req.body;

    const deletedMedicine = await medicineModel.findOneAndDelete({ medicineCode });
    
    if (!deletedMedicine) {
      return res.status(404).json({ success: false,error: "Medicine not found" });
    }
    
    return res.json({success: true , message: "Medicine deleted successfully" });  
}

const searchMedicine = async (req,res) => {
    try {
        const { medicineCode } = req.body;
    
        if (!medicineCode) {
          return res.status(400).json({ success: false, error: "medicineCode is required" });
        }
    
        const medicine = await medicineModel.findOne({ medicineCode });
    
        if (!medicine) {
          return res.status(404).json({ success: false, error: "Medicine not found" });
        }
    
        return res.json({ success: true, medicine });
    }catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
export { addMedicine, viewAllMedicines, ExpiredMedicines,deleteMedicine };
