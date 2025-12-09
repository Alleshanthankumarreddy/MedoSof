import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    shopCode: { type: String, required: true },              
    medicineCode: { type: String, required: true, unique: true },
    tradeName: { type: String, required: true },           
    usageDescription: { type: String, required: true },  
    rackCode: { type: String, required: true },             
    unitCostPrice: { type: Number, required: true },   
    unitSellingPrice: { type: Number, required: true }, 
    medicineName: { type: String, required: true },        
    totalQuantity: { type: Number, required: true },
    thresholdValue: { type: Number, required: true, default: 50}        
  },
  { timestamps: true } 
);

const medicineModel = mongoose.models.medicine || mongoose.model("medicine", medicineSchema);

export default medicineModel;
