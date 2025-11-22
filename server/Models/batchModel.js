import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    medicineCode: { type: String, required: true},
    batchCode: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 0 },
    vendorMail: { type: String, required: true},
    dateReceived: { type: Date, required: true, default: Date.now },
    shopCode: { type: String, required: true }
}, { timestamps: true });

const batchModel = mongoose.models.batch || mongoose.model('batch', batchSchema);

export default batchModel;
