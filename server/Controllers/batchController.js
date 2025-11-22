import batchModel from "../Models/batchModel.js";
import medicineModel from "../Models/medicineModel.js";
import ownerModel from "../Models/ownerModel.js";
import vendorModel from "../Models/vendorModel.js";

const expiredMedicines = async (req, res) => {
    try {
      const { shopCode } = req.body;
  
      if (!shopCode) {
        return res.status(400).json({ success: false, message: "Missing shopCode" });
      }
  
      // ✅ Check if shop exists
      const shop = await ownerModel.findOne({ shopCode });
      if (!shop) {
        return res.status(404).json({ success: false, message: "Invalid shopCode" });
      }
  
      const today = new Date();
  
      // ✅ Find expired batches
      const expiredBatches = await batchModel.find({
        shopCode,
        expiryDate: { $lt: today },
      });
  
      if (expiredBatches.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No expired medicines found",
          data: [],
        });
      }
  
      const medicineCodes = expiredBatches.map((b) => b.medicineCode);
  
      const medicines = await medicineModel.find({
        medicineCode: { $in: medicineCodes },
      });
 
      const expiredWithNames = expiredBatches.map((batch) => {
        const matchedMedicine = medicines.find(
          (med) => med.medicineCode === batch.medicineCode
        );
  
        return {
          ...batch._doc, 
          medicineName: matchedMedicine ? matchedMedicine.medicineName : "Unknown",
        };
      });

      res.status(200).json({
        success: true,
        message: "Expired medicines retrieved successfully",
        data: expiredWithNames,
      });
    } catch (error) {
      console.error("Error retrieving expired medicines:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
  
const addBatch = async (req, res) => {
    try {
        const { medicineCode, batchCode, expiryDate, quantity, vendorMail, dateReceived, shopCode } = req.body;

        if (!medicineCode || !batchCode || !expiryDate || quantity == null || !vendorMail || !shopCode) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const expiry = new Date(expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expiry <= today) {
            return res.status(400).json({ success: false, message: "Invalid expiry date. It must be a future date." });
        }

        const medicine = await medicineModel.findOne({ medicineCode });
        if (!medicine) {
            return res.status(404).json({ success: false, message: "Invalid medicineCode" });
        }

        const shop = await ownerModel.findOne({ shopCode });
        if (!shop) {
            return res.status(404).json({ success: false, message: "Invalid shopCode" });
        }

        const vendor = await vendorModel.findOne({ mail: vendorMail });
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Invalid vendorMail" });
        }

        const existingBatch = await batchModel.findOne({ batchCode, medicineCode, shopCode });
        if (existingBatch) {
            return res.status(400).json({ success: false, message: "Batch already exists for this medicine in this shop" });
        }

        const newBatch = new batchModel({
            medicineCode,
            batchCode,
            expiryDate: expiry,
            quantity,
            vendorMail,
            dateReceived: dateReceived || Date.now(),
            shopCode
        });

        const savedBatch = await newBatch.save();

        await medicineModel.findOneAndUpdate(
            { medicineCode },
            { $inc: { totalQuantity: quantity } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Batch added successfully and medicine quantity updated",
            batch: savedBatch
        });

    } catch (error) {
        console.error("Error adding batch:", error);
        res.status(500).json({
            success: false,
            message: "Server error while adding batch",
            error: error.message
        });
    }
};

const removeExpiredMedicines = async (req, res) => {
    try {
        const { shopCode } = req.body;

        if (!shopCode) {
            return res.status(400).json({ success: false, message: "Missing shopCode" });
        }
        
        const shopExists = await ownerModel.findOne({ shopCode });
        if (!shopExists) {
            return res.status(404).json({ success: false, message: "Invalid shopCode" });
        }

        const batches = await batchModel.find({ shopCode });
        if (batches.length === 0) {
            return res.status(200).json({ success: true, message: "No batches found for this shop" });
        }

        const today = new Date();
        let expiredCount = 0;
        const deletedBatches = []; 

        for (const batch of batches) {
            if (batch.expiryDate < today) {
                await batchModel.deleteOne({ _id: batch._id });
        
                const medicine = await medicineModel.findOne({ medicineCode: batch.medicineCode });
                if (medicine) {
                    const newQuantity = Math.max(0, medicine.totalQuantity - batch.quantity);
                    await medicineModel.updateOne(
                        { medicineCode: batch.medicineCode },
                        { totalQuantity: newQuantity }  
                    );
                }
        
                expiredCount++;
                deletedBatches.push({ batchCode: batch.batchCode, medicineCode: batch.medicineCode });
            }
        }        

        res.status(200).json({
            success: true,
            message: expiredCount > 0 ? "Expired medicines removed successfully" : "No expired medicines found",
            deletedCount: expiredCount,
            deletedBatches
        });

    } catch (error) {
        console.error("Error removing expired medicines:", error);
        res.status(500).json({
            success: false,
            message: "Server error while removing expired medicines",
            error: error.message
        });
    }
};

export { expiredMedicines, addBatch, removeExpiredMedicines};
