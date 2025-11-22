import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    medicineCode: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    vendorMail: { type: String, required: true },
    shopCode: { type: String, required: true},
    time: { type: Date, default: Date.now },
    expiryDate: {type: Date, required: true}
  },
  { timestamps: true }
);

const purchaseModel = mongoose.models.purchase || mongoose.model("purchase", purchaseSchema);

export default purchaseModel;
