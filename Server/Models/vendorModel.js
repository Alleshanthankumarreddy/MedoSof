import mongoose from "mongoose";
 
const vendorSchema = new mongoose.Schema({
    name: {type: String,required: true},
    mail: {type: String,required: true,unique: true},
    contactNumber: {type: String,required: true }
},{ timestamps: true });

const vendorModel = mongoose.models.vendor || mongoose.model('vendor',vendorSchema);

export default vendorModel;