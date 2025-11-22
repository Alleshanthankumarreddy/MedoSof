import ownerModel from "../Models/ownerModel.js";
import medicineModel from "../Models/medicineModel.js";
import salesModel from "../Models/salesModel.js";
import batchModel from "../Models/batchModel.js";

const addSales = async (req, res) => {
  try {
    const { shopCode, listOfMedicines, paymentMode, customerName, customerContactNumber } = req.body;

    // 🧾 Validate required fields
    if (!shopCode || !listOfMedicines || listOfMedicines.length === 0 || !paymentMode || !customerName || !customerContactNumber) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 🏪 Check if shop exists
    const validShop = await ownerModel.findOne({ shopCode });
    if (!validShop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    let totalAmount = 0;

    // ✅ 1. Check if all medicines are available and stock is sufficient
    for (const item of listOfMedicines) {
      const { medicineCode, quantity } = item;

      const medicine = await medicineModel.findOne({ shopCode, medicineCode });
      if (!medicine) {
        return res.status(404).json({ success: false, message: `Medicine ${medicineCode} not found in this shop` });
      }

      if (medicine.totalQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for medicine ${medicineCode}. Available: ${medicine.totalQuantity}`
        });
      }

      totalAmount += medicine.unitSellingPrice * quantity;
    }

    // ✅ 2. Deduct quantities from batches (FIFO by expiry date) and update medicine quantity once
    for (const item of listOfMedicines) {
      const { medicineCode, quantity } = item;

      let qtyToDeduct = quantity;
      const batches = await batchModel.find({ shopCode, medicineCode }).sort({ expiryDate: 1 });

      if (!batches || batches.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No batch found for medicine ${medicineCode}`
        });
      }

      for (const batch of batches) {
        if (qtyToDeduct <= 0) break;

        if (batch.quantity >= qtyToDeduct) {
          batch.quantity -= qtyToDeduct;
          await batch.save();

          if (batch.quantity === 0) {
            await batchModel.deleteOne({ _id: batch._id });
          }

          qtyToDeduct = 0;
        } else {
          qtyToDeduct -= batch.quantity;
          batch.quantity = 0;
          await batch.save();
          await batchModel.deleteOne({ _id: batch._id });
        }
      }

      if (qtyToDeduct > 0) {
        return res.status(400).json({
          success: false,
          message: `Not enough batch stock for medicine ${medicineCode}`
        });
      }

      // 📉 Update total quantity in medicine once here
      await medicineModel.updateOne(
        { shopCode, medicineCode },
        { $inc: { totalQuantity: -quantity } }
      );
    }

    // 🧾 3. Save the sale record
    const newSale = new salesModel({
      shopCode,
      listOfMedicines,
      totalAmount,
      paymentMode,
      customerName,
      customerContactNumber
    });

    await newSale.save();

    return res.status(201).json({
      success: true,
      message: "Sale added successfully",
      sale: newSale
    });

  } catch (error) {
    console.error("Error adding sale:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export { addSales };
