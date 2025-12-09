import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import vendorModel from "../Models/vendorModel.js";
import medicineModel from "../Models/medicineModel.js";



const addVendorMedicine = async (req, res) => {
     try {
    const { medicineCode, vendorMail } = req.body;

    if (!medicineCode || !vendorMail) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const medicine = await medicineModel.findOne({ medicineCode });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const vendor = await vendorModel.findOne({ mail: vendorMail });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const updatedVendor = await vendorModel.findByIdAndUpdate(
      vendor._id,
      { $addToSet: { medicines: medicine._id } },
      { new: true }
    ).populate("medicines");

    res.status(200).json({
      message: "Medicine added successfully",
      vendor: updatedVendor
    });

  } catch (error) {
    console.error("Error adding vendor medicine:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateVendorContact = async (req, res) => {
    try {
        const { mail, newContactNumber } = req.body;

        if (!mail || !newContactNumber) {
            return res.status(400).json({ success: false, message: "Missing email or new contact number" });
        }

        const updatedVendor = await vendorModel.findOneAndUpdate(
            { mail },                       
            { contactNumber: newContactNumber }, 
            { new: true }               
        );

        if (!updatedVendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        res.status(200).json({ success: true, message: "Contact number updated successfully", vendor: updatedVendor });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const showAllVendors = async (req, res) => {
    try {
      const vendors = await vendorModel.find().populate("medicines");
  
      if (!vendors || vendors.length === 0) {
        return res.status(404).json({success: false, message: "No vendors found in the database",});
      }

      return res.status(200).json({success: true,message: "Vendors fetched successfully",vendors,});

    } catch (error) {
      console.error("Error fetching vendors:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching vendors",
        error: error.message,
      });
    }
  };

const signup = async (req,res) => {
  try {
    const { name, mail, password, contactNumber } = req.body;

    if (!name || !mail || !password || !contactNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVendor = await vendorModel.findOne({ mail });
    if (existingVendor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await vendorModel.create({
      name,
      mail : mail,
      password: hashedPassword,
      contactNumber,
      medicines: [],
    });

    const token = jwt.sign(
      {
        id: vendor._id,
        mail: vendor.mail,
        name: vendor.name,
        type: "vendor",
      },
      process.env.VENDOR_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      token,
      vendor,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const signin = async (req,res) => {
try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const vendor = await vendorModel.findOne({ mail });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: vendor._id,
        mail: vendor.mail,
        name: vendor.name,
        type: "vendor",
      },
      process.env.VENDOR_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      token,
      vendor,
    });

  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


const listOfMedicinesSupplied = async (req, res) => {
  try {
    const { mail } = req.query;

    if (!mail) {
      return res.status(400).json({success: false, message: "Vendor mail does not exist",});
    }

    const vendor = await vendorModel
      .findOne({ mail })
      .populate("medicines");

    if (!vendor) {
      return res.status(404).json({success: false,message: "Vendor not found",});
    }

    return res.status(200).json({
      success: true,
      medicines: vendor.medicines,
    });
  } catch (error) {
    console.error("Error fetching vendor medicines:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMedicines = async (req,res) => {
  try {
    const { vendorMail, medicineCode } = req.body;

    if (!vendorMail || !medicineCode) {
      return res.status(400).json({
        success: false,
        message: "vendorMail and medicineCode are required",
      });
    }

    // 1️⃣ Find vendor
    const vendor = await vendorModel.findOne({ mail: vendorMail });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // 2️⃣ Find medicine by code
    const medicine = await medicineModel.findOne({ medicineCode });
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // 3️⃣ Check if vendor has this medicine
    const exists = vendor.medicines.includes(medicine._id);
    if (!exists) {
      return res.status(400).json({
        success: false,
        message: "Vendor is not supplying this medicine",
      });
    }

    // 4️⃣ Remove the medicine ID from vendor.medicines
    vendor.medicines = vendor.medicines.filter(
      (id) => id.toString() !== medicine._id.toString()
    );

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Medicine removed from vendor list successfully",
      vendor,
    });

  } catch (error) {
    console.error("Error deleting vendor medicine:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting vendor medicine",
      error: error.message,
    });
  }
}

export { addVendorMedicine, deleteMedicines, updateVendorContact, showAllVendors, signin, signup,  listOfMedicinesSupplied };
