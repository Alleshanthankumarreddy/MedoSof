import mongoose from 'mogoose'

const medicineBatchSchema = new mongoose.Schema({

  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  batchNumber: { type: String },
  expiryDate: { type: Date, required: true },
  quantityInStock: { type: Number, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  dateReceived: { type: Date, default: Date.now }
  
}, { timestamps: true });

const medicineBatchModel = mongoose.models.MedicineBatch || mongoose.model("MedicineBatch", medicineBatchSchema);

export default medicineBatchModel;