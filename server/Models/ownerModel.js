import mongoose from "mongoose"

const ownerSchema = new mongoose.Schema({
    name: {type: String,required: true,},
    mail: {type: String,required: true,unique: true,},
    password : {type: String,required: true},
    shopCode: {type: String,required: true,unique: true,},
    shopName: {type: String,required: true,},
    shopAddress: {type: String,required: true,},
    numberOfStaff: {type: Number,default: 0,}
    }, { timestamps: true });

const ownerModel = mongoose.models.owner || mongoose.model('owner',ownerSchema);

export default ownerModel