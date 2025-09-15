import mongoose from 'mongoose'

const salesSchema = new mongoose.Schema({
    saleDate: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ["Cash", "Card", "UPI", "Cheque"], required: true },
    totalAmount: { type: Number, required: true }
  }, { timestamps: true });
  
  export default mongoose.models.Sales || mongoose.model("Sales", salesSchema);