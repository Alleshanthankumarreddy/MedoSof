import mongoose from "mongoose";

const thresholdSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true, unique: true },
  thresholdQuantity: { type: Number, required: true, default: 200 },
  alertEnabled: { type: Boolean, default: false }
}, { timestamps: true });

const thresholdModel = mongoose.models.Threshold || mongoose.model("Threshold", thresholdSchema);

export default thresholdModel;
