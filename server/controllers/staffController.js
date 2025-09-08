import bcrypt from 'bcrypt'
import staffModel from '../models/staffModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const login = async (req,res) => {

    try {
        const {email,password,codeWord} = req.body

        if (!email || !password ) {
            return res.status(400).json({ success: false, message: "Missing Details" })   
        }

        const staff = await staffModel.findOne({email})

        if (!staff) {
            return res.json({ success: false, message: "Email does not exists" });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Check the password once" });
        }

        if(codeWord !== "SRI496_SHOP") {
            return res.json({ success: false, message: "Check the codeWord once" });
        }

        const token = jwt.sign({ id: staff._id }, "shanthan");
        res.json({ success: true, token, staff: { name: staff.name, email: staff.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
  }
}





export {login};