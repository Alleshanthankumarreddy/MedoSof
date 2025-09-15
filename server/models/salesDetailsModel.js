import mongoose from 'mongoose';

const salesDetailsSchema = new mongoose.Schema({
  saleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Sales", 
    required: true 
  },
  batchIds: [
    {
      batchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "MedicineBatch", 
        required: true 
      },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.models.SalesDetails || mongoose.model("SalesDetails", salesDetailsSchema);
