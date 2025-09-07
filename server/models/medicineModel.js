import mongoose from "mongoose"

const medicineSchema = new mongoose.Schema({
  medicineCode: { type: String, required: true, unique: true },
  tradeName: { type: String, required: true },
  genericName: { type: String, required: true },
  description: { type: String },
  usageInstructions: { type: String },
  rackId: { type: mongoose.Schema.Types.ObjectId, ref: "Rack" },
  unitPurchasePrice: { type: Number, required: true },
  unitSellingPrice: { type: Number, required: true }
}, { timestamps: true });

const medicineModel = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

export default medicineModel