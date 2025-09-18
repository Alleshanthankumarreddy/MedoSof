import medicineBatchModel from "../models/medicineBatchModel.js";
import medicineModel from "../models/medicineModel.js";
import vendorModel from "../models/vendorModel.js";
 //THis shpuld be while we received the batch from vendor
const addBatch = async (req, res) => {
  try {
    const { medicineCode, batchNumber, expiryDate, quantityInStock, vendorEmail, dateReceived } = req.body;

    if (!medicineCode || !expiryDate || !quantityInStock || !vendorEmail) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const medicine = await medicineModel.findOne({ medicineCode });
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    const vendor = await vendorModel.findOne({ email: vendorEmail });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const newBatch = new medicineBatchModel({
      medicineId: medicine._id,
      batchNumber,
      expiryDate,
      quantityInStock,
      vendorId: vendor._id,
      dateReceived: dateReceived || Date.now()
    });

    await newBatch.save();

    return res.status(201).json({ success: true, message: "Batch added successfully", batch: newBatch });

  } catch (error) {
    console.error("Error adding batch:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { addBatch };
