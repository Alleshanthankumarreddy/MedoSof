import bcrypt from 'bcrypt';

import staffModel from "../models/staffModel.js";

const login = (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing Details" 
        });
    }

    if (name !== process.env.OWNER_NAME || password !== process.env.OWNER_PASSWORD) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid owner credentials" 
        });
    }

    return res.status(200).json({ 
        success: true, 
        message: "Successfully logged in as owner" 
    });
};

const addStaff = async (req,res) => {
    try {
        const {name,email,password} = req.body

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Missing Details" })   
        }

        const hashedPassword = await bcrypt.hash(password,10)
        
        const newStaff = await staffModel.create({
        name,
        email,
        password : hashedPassword
        })
        res.json({success:true,message : "successfully added the staff person"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { login ,addStaff};
