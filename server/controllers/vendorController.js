import vendorModel from "../models/vendorModel.js";


const addVendor = async (req, res) => {
    try {
      const { name, address, contactNumber, email, medicineCodes } = req.body;
  
      if (!name || !address || !contactNumber || !email || !medicineCodes) {
        return res
          .status(400)
          .json({ success: false, message: "Missing some details" });
      }

      let vendor = await vendorModel.findOne({ email });
  
      if (vendor) {
        const updatedCodes = new Set([...vendor.medicineCodes, ...medicineCodes]);
        vendor.medicineCodes = Array.from(updatedCodes);
  
        await vendor.save();
  
        return res.status(200).json({success: true,message: "Vendor updated with new medicine codes",data: vendor,});
      } else {
        vendor = await vendorModel.create({
          name,
          address,
          contactNumber,
          email,
          medicineCodes,
        });
  
        return res.status(201).json({success: true,message: "New vendor created successfully",data: vendor,});
      }
    } catch (error) {
      return res.status(500).json({success: false,message: "Server error",error: error.message,});
    }
  };
  
  export {addVendor}