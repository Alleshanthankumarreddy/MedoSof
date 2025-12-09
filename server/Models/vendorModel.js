import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: {type: Number,required: true},
    medicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "medicine", 
      }
    ]
  },
  { timestamps: true }
);

const Vendor =
  mongoose.models.Vendor || mongoose.model("vendor", vendorSchema);

export default Vendor;
