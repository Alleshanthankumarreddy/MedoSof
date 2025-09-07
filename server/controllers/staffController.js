import bcrypt from 'bcrypt'
import staffModel from '../models/staffModel.js';
import jwt from 'jsonwebtoken';

const register = async (req,res) => {

    try {
        const { name, password, email} = req.body
        
        if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const existingUser = await staffModel.findOne({ email });

        if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await staffModel.create({
            name,
            email,
            password : hashedPassword
        })

        const token = jwt.sign({id : newUser._id}, "staffPassword")

        res.status(201).json({success : true,token,staffName : {name}})

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const login = async (req,res) => {

    try {
        const {email,password,codeWord} = req.body

        if (!email || !password) {
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

        const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name, email: user.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
  }
}






export {register,login};