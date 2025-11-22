import medicineModel from "../Models/medicineModel.js";
import ownerModel from "../Models/ownerModel.js";
import vendorModel from "../Models/vendorModel.js";
import purchaseModel from "../Models/purchaseModel.js";

const addPurchase = async (req, res) => {
    try {
        const { medicineCode, quantity, vendorMail, shopCode, expiryDate } = req.body;

        if (!medicineCode || !quantity || !vendorMail || !shopCode || !expiryDate) {
        return res.status(400).json({success: false,message: "Missing credentials"});
        }

        const expiry = new Date(expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        if (expiry <= today) {
        return res.status(400).json({success: false,message: "Expiry date must be greater than today",});
        }

        const validShop = await ownerModel.findOne({ shopCode });
        if (!validShop) {
        return res.status(400).json({success: false,message: "Invalid shop code. Please check and try again.",});
        }

        const validMedicine = await medicineModel.findOne({ medicineCode, shopCode });
        if (!validMedicine) {
        return res.status(400).json({success: false,message: "No such medicine exists in this shop.",});
        }

        const validVendor = await vendorModel.findOne({ mail: vendorMail });
        if (!validVendor) {
        return res.status(400).json({success: false,message: "No vendor found with this email.",});
        }

        const newPurchase = new purchaseModel({
        medicineCode,
        quantity,
        vendorMail,
        shopCode,
        expiryDate,
        });

        const savedPurchase = await newPurchase.save();

        return res.status(201).json({
            success: true,
            message: "Purchase added successfully.",
            purchase: savedPurchase,
        });
    } catch (error) {
        console.error("Error adding purchase:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
};

export { addPurchase };
