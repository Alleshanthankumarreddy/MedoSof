import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  email: { type: String },
  medicineCodes: [{ type: String, required: true }]
}, { timestamps: true });

const vendorModel = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default vendorModel;