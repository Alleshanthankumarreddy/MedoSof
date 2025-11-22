import mongoose from "mongoose";
 
const rackSchema = new mongoose.Schema({
    rackCode: {type: String,required: true,unique: true},
    position: {type: String,required: true},
    shopCode: {type: String,required: true}
},{ timestamps: true });

const rackModel = mongoose.models.rack || mongoose.model('rack',rackSchema);

export default rackModel;