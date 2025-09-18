import medicineBatchModel from "../models/medicineBatchModel.js";
import medicineModel from "../models/medicineModel.js";
import salesDetailsModel from "../models/salesDetailsModel.js";
import salesModel from "../models/salesModel.js";

const GenerateReceipt = async (req, res) => {
  try {
    const { medicineMap, mode } = req.body; 
    // medicineMap = { "M001": 12,"M002": 7 } 

    if (!medicineMap || !mode) {
      return res.status(400).json({ success: false, message: "Missing the Details" });
    }

    let totalAmount = 0;
    let salesDetails = [];

    for (const [medicineCode, quantity] of Object.entries(medicineMap)) {
        const medicine = await medicineModel.findOne({ medicineCode });

        if (!medicine) {
            return res.status(404).json({ success: false, message: `Medicine ${medicineCode} not found` });
        }

        const medicineId = medicine._id;

        const medicineBatches = await medicineBatchModel.find({ medicineId }).sort({ expiryDate: 1 });

        let availableQuantity = medicineBatches.reduce((sum, b) => sum + b.quantityInStock, 0);

        if (quantity > availableQuantity) {
            return res.status(400).json({ success: false, message: `Insufficient stock for ${medicineCode}` });
        }

        let remainingQuantity = quantity;

        for (let batch of medicineBatches) {
            if (remainingQuantity === 0) break;

            let usedQuantity = 0;

            if (batch.quantityInStock <= remainingQuantity) {
            usedQuantity = batch.quantityInStock;
            remainingQuantity -= batch.quantityInStock;

            await medicineBatchModel.findByIdAndDelete(batch._id);
            } else {
            usedQuantity = remainingQuantity;
            batch.quantityInStock -= remainingQuantity;
            remainingQuantity = 0;
            await batch.save();
            }

            if (usedQuantity > 0) {
            const lineTotal = medicine.unitSellingPrice * usedQuantity;
            totalAmount += lineTotal;

            salesDetails.push({
                batchId: batch._id,
                quantity: usedQuantity,
                unitPrice: medicine.unitSellingPrice,
                totalPrice: lineTotal,
            });
            }
        }
    }

    const sale = await salesModel.create({
      saleDate: Date.now(),
      paymentMode: mode,
      totalAmount,
    });

    for (const detail of salesDetails) {
      await salesDetailsModel.create({
        saleId: sale._id,
        batchIds: [detail],
      });
    }

    const receipt = {
      sale: {
        id: sale._id,
        saleDate: sale.saleDate,
        paymentMode: sale.paymentMode,
        totalAmount: sale.totalAmount,
      },
      items: await salesDetailsModel.find({ saleId: sale._id })
    };

    return res.status(200).json({ success: true, message: "Receipt generated successfully", receipt });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};




export { GenerateReceipt };
