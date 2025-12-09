import bcrypt from "bcrypt";
import staffModel from "../Models/staffModel.js";
import jwt from "jsonwebtoken";
import ownerModel from "../Models/ownerModel.js";

const signup = async (req, res) => {
  try {
    const { name, mail, password, shopCode } = req.body;

    if (!name || !mail || !password || !shopCode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingStaff = await staffModel.findOne({ mail });
    if (existingStaff) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const staffList = await staffModel.find({ shopCode });
    const staffCount = staffList.length;

    const shopOwner = await ownerModel.findOne({ shopCode });

    if (!shopOwner) {
        return res.status(404).json({ success: false, message: "Invalid shop Code" });
    }

    if (staffCount >= shopOwner.numberOfStaff) {
        return res.status(400).json({success: false,message: "Staff capacity full. Ask the owner to update the staff limit if you want to join.",});
    }   


    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new staffModel({
      name,
      mail,
      password: hashedPassword,
      shopCode,
    });

    const staff = await newStaff.save();

    const token = jwt.sign({ id: staff._id, mail: staff.mail },process.env.STAFF_JWT_SECRET );

    return res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        mail: staff.mail,
        shopCode: staff.shopCode,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const staff = await staffModel.findOne({ mail });
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: staff._id, mail: staff.mail },process.env.STAFF_JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        mail: staff.mail,
        shopCode: staff.shopCode,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const { shopCode } = req.params;   
    console.log(shopCode);
    if (!shopCode) {
      return res.status(400).json({ message: "shopCode is required" });
    }

    const staff = await staffModel.find({ shopCode });

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff
    });

  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const removeStaff = async (req, res) => {
  try {
    const { shopCode, mail } = req.body;

    if (!shopCode || !mail) {
      return res.status(400).json({
        success: false,
        message: "shopCode and mail are required"
      });
    }

    const deletedStaff = await staffModel.findOneAndDelete({
      shopCode: shopCode,
      mail: mail
    });

    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: "No staff found with this mail under this shop"
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff removed successfully",
      deletedStaff
    });

  } catch (error) {
    console.error("Error removing staff:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export { signup,signin,getAllStaff,removeStaff };
