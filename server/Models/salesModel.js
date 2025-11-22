import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    listOfMedicines: [
      {
        medicineCode: { type: String, required: true },
        quantity: { type: Number, required: true,min: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, required: true},
    customerName: { type: String, required: true },
    customerContactNumber: { type: String, required: true },
    time: { type: Date, default: Date.now },
    shopCode: {type: String, required: true}
  },
  { timestamps: true }
);

const salesModel = mongoose.models.sales || mongoose.model("sales", salesSchema);

export default salesModel;
