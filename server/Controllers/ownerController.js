import bcrypt from "bcrypt";
import ownerModel from "../Models/ownerModel.js";
import jwt from "jsonwebtoken";



const signup = async (req, res) => {
  try {
    const { name, mail, password, shopCode, shopName, shopAddress, numberOfStaff } = req.body;

    if (!name || !mail || !password || !shopCode || !shopName || !shopAddress || ((numberOfStaff !== 0) && !numberOfStaff)) {
      return res.status(400).json({ success: false, message: "Credentials are missing" });
    }

    const shopCodeClean = shopCode.trim().toUpperCase();

    const existingShopCode = await ownerModel.findOne({ shopCode: shopCodeClean });

    if(existingShopCode) {
        return res.status(400).json({success: false,message: "Shop code already exists"});
    }

    const existingOwner = await ownerModel.findOne({ mail });

    if (existingOwner) {
      return res.status(400).json({success: false,message: "Owner with this email already exists"});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newOwner = new ownerModel({
      name,
      mail,
      password: hashedPassword,
      shopCode: shopCodeClean,
      shopName,
      shopAddress,
      numberOfStaff,
    });

    const owner = await newOwner.save();

    const token = jwt.sign({ id: owner._id, mail: owner.mail },process.env.OWNER_JWT_SECRET);

    return res.status(201).json({
      success: true,
      message: "Owner registered successfully",
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        mail: owner.mail,
        shopCode: owner.shopCode,
        shopName: owner.shopName,
        shopAddress: owner.shopAddress,
        numberOfStaff: owner.numberOfStaff,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const signin = async (req,res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
          return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        

        const owner = await ownerModel.findOne({ mail });
        if (!owner) {
          return res.status(404).json({ success: false, message: "Owner not found" });
        }

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: owner._id, mail: owner.mail },process.env.OWNER_JWT_SECRET);

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          owner: {
            id: owner._id,
            name: owner.name,
            mail: owner.mail,
            shopCode: owner.shopCode,
            shopName: owner.shopName,
            shopAddress: owner.shopAddress,
            numberOfStaff: owner.numberOfStaff,
          },
        });
      } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
      }
    
}

export { signup ,signin};
