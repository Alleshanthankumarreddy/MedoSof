import vendorModel from "../Models/vendorModel.js";

const addVendor = async (req, res) => {
    try {
        const { mail, contactNumber, name } = req.body;

        if (!mail || !contactNumber || !name) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        const existingVendor = await vendorModel.findOne({ mail });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: "Vendor already exists with this email" });
        }

        const newVendor = new vendorModel({
            mail,
            contactNumber,
            name
        });

        const vendor = await newVendor.save();

        res.status(201).json({ success: true, message: "Vendor added successfully", vendor });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
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

export { addVendor,updateVendorContact };
