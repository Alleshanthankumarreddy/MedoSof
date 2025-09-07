import mongoose from 'mongoose'
 
const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  medicalShopName: { type: String },
  medicalShopAddress: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const ownerModel = mongoose.models.User || mongoose.model("Owner", ownerSchema);

export default ownerModel