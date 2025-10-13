import mongoose from "mongoose"
const staffSchema = new mongoose.Schema({
    name: {type: String,required: true,},
    mail: {type: String,required: true,unique: true,},
    password: {type: String,required: true,},
    shopCode: {type: String,required: true,}
    }, { timestamps: true });

const staffModel = mongoose.models.staff || mongoose.model('staff',staffSchema);

export default staffModel