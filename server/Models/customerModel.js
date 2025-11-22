import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    customerName: {type: String, required: true, trim: true,},
    customerMail: {type: String, required: true, unique: true},
    customerPhone: {type: String, required: true, trim: true},
    address: {type: String, trim: true,},
    age: {type: Number, min: 1, max: 120,},
    gender: {type: String, enum: ["Male", "Female", "Other"],},
}, { timestamps: true });

const customerModel = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default customerModel;
