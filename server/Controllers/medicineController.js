import medicineModel from "../Models/medicineModel.js";
import ownerModel from "../Models/ownerModel.js";
import rackModel from "../Models/rackModel.js";
import vendorModel from "../Models/vendorModel.js";
import salesModel from "../Models/salesModel.js";
import batchModel from "../Models/batchModel.js"

const addMedicine = async (req, res) => {
  try {
    const {
      shopCode,
      medicineCode,
      tradeName,
      usageDescription,
      rackCode,
      unitCostPrice,
      unitSellingPrice,
      medicineName
    } = req.body;

    if (
      !shopCode ||
      !medicineCode ||
      !tradeName ||
      !usageDescription ||
      !rackCode ||
      !unitCostPrice ||
      !unitSellingPrice ||
      !medicineName 
    ) {
      return res.status(400).json({ success: false, message: "Missing Credentails" });
    }

    const validshopCode = await ownerModel.findOne({shopCode});

    if(!validshopCode) {
        return res.status(400).json({success: false,message: "Check the shop code once,shop code does not exists"});
    }

    const validRackCode = await rackModel.findOne({ shopCode, rackCode });

    if(!validRackCode) {
        return res.status(400).json({success: false,message: "Check the Rack code once,Rack code does not exists"});
    }

    const isRackEmpty = await medicineModel.findOne({ shopCode, rackCode })

    if(isRackEmpty) {
        return res.status(400).json({success: false,message: "Rack is filled with some other medicine"});
    }

    const existingMedicine = await medicineModel.findOne({ shopCode, medicineCode });

    if (existingMedicine) {
      return res.status(400).json({success: false,message: "Medicine with this code already exists in the shop"});
    }

    const newMedicine = await medicineModel.create({
      shopCode,
      medicineCode,
      tradeName,
      usageDescription,
      rackCode,
      unitCostPrice,
      unitSellingPrice,
      medicineName,
      totalQuantity : 0,
      thresholdValue : 50,
    });

    return res.status(201).json({success: true,message: "Medicine added successfully",data: newMedicine});
  } catch (error) {
    console.error("Error adding medicine:", error);
    return res.status(500).json({success: false,message: "Server error",error: error.message});
  }
};

const deleteMedicine = async (req,res) => {
    try{
        const { shopCode,medicineCode} = req.body;

        if(!shopCode || !medicineCode) {
            return res.status(400).json({success: false,message: "Missing Credentails"});
        }

        const validshopCode = await ownerModel.findOne({shopCode});

        if(!validshopCode) {
            return res.status(400).json({success: false,message: "Check the shop code once,shop code does not exists"});
        }

        const existingMedicine = await medicineModel.findOne({ shopCode, medicineCode });

        if (!existingMedicine) {
        return res.status(400).json({success: false,message: "Medicine with this code does not exists in the shop"});
        }

        await medicineModel.deleteOne({ shopCode, medicineCode });

        await batchModel.deleteMany({ shopCode, medicineCode });

        return res.status(200).json({success: true, message: `Medicine with code ${medicineCode} deleted successfully from shop ${shopCode}`});

    } catch (error) {
        console.error("Error deleting medicine:", error);
        return res.status(500).json({success: false, message: "Server error", error: error.message});
    }
}

const updateRackCode = async (req,res) => {
    try {
        const { shopCode, medicineCode, newRackCode } = req.body;

        if (!shopCode || !medicineCode || !newRackCode) {
          return res.status(400).json({success: false,message: "Missing credentials. Please provide shopCode, medicineCode, and newRackCode."});
        }

        const validShop = await ownerModel.findOne({ shopCode });
        if (!validShop) {
          return res.status(400).json({success: false,message: "Shop code not found. Please check again."});
        }

        const existingMedicine = await medicineModel.findOne({ shopCode, medicineCode });
        if (!existingMedicine) {
          return res.status(404).json({success: false,message: "Medicine not found for the given shop and medicine code."});
        }

        const validRack = await ownerModel.findOne({ shopCode,newRackCode });
        if (!validRack) {
          return res.status(400).json({success: false,message: "Rcak code not found. Please check again."});
        }


        existingMedicine.rackCode = newRackCode;
        await existingMedicine.save();

        return res.status(200).json({success: true,message: `Rack code updated successfully for medicine ${medicineCode}`,updatedMedicine: existingMedicine});
    
    } catch (error) {
        console.error("Error updating rack code:", error);
        return res.status(500).json({success: false,message: "Server error",error: error.message});
      }
};
    
const updateUnitCostPrice = async (req, res) => {
    try {
        const { shopCode, medicineCode, newUnitCostPrice } = req.body;
    
        if (!shopCode || !medicineCode || newUnitCostPrice == null) {
            return res.status(400).json({success: false,message: "Missing credentials. Please provide shopCode, medicineCode and newUnitCostPrice."});
        }
    
        const validShop = await ownerModel.findOne({ shopCode });
        if (!validShop) {
            return res.status(400).json({ success: false, message: "Shop code not found. Please check again." });
        }
    
        const existingMedicine = await medicineModel.findOne({ shopCode, medicineCode });
        if (!existingMedicine) {
            return res.status(404).json({ success: false, message: "Medicine not found for the given shop and medicine code." });
        }
    
        existingMedicine.unitCostPrice = newUnitCostPrice;
        await existingMedicine.save();
    
        return res.status(200).json({success: true,message: `Unit cost price updated successfully for medicine ${medicineCode}`,updatedMedicine: existingMedicine});
  
    } catch (error) {
        console.error("Error updating unit cost price:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

const updateUnitSellingPrice = async (req, res) => {
    try {
        const { shopCode, medicineCode, newUnitSellingPrice } = req.body;
    
        if (!shopCode || !medicineCode || newUnitSellingPrice == null) {
            return res.status(400).json({success: false,message: "Missing credentials. Please provide shopCode, medicineCode and newUnitSellingPrice."});
        }
    
        const validShop = await ownerModel.findOne({ shopCode });
        if (!validShop) {
            return res.status(400).json({ success: false, message: "Shop code not found. Please check again." });
        }
    
        const existingMedicine = await medicineModel.findOne({ shopCode, medicineCode });
        if (!existingMedicine) {
            return res.status(404).json({ success: false, message: "Medicine not found for the given shop and medicine code." });
        }
    
        existingMedicine.unitSellingPrice = newUnitSellingPrice;
        await existingMedicine.save();
    
        return res.status(200).json({success: true,message: `Unit selling price updated successfully for medicine ${medicineCode}`,updatedMedicine: existingMedicine});
    
    } catch (error) {
        console.error("Error updating unit selling price:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const calculateThreshold = async (req, res) => {
    try {
        const { shopCode } = req.body;
    
        if (!shopCode) {
            return res.status(400).json({ success: false, message: "Shop code is required" });
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSales = await salesModel.find({
            shopCode,
            createdAt: { $gte: sevenDaysAgo }
        });
    
        if (recentSales.length === 0) {
            return res.status(200).json({ success: true, message: "No sales found in the last 7 days", updatedMedicines: [] });
        }

        const medicineSalesMap = new Map();
        for (const sale of recentSales) {
            for (const item of sale.listOfMedicines) {
            const prev = medicineSalesMap.get(item.medicineCode) || 0;
            medicineSalesMap.set(item.medicineCode, prev + item.quantity);
            }
        }

        const updatedMedicines = [];
        for (const [medicineCode, totalSold] of medicineSalesMap.entries()) {
            const avgPerDay = totalSold / 7;
            const safetyFactor = 1.5;
            const newThreshold = Math.max(Math.ceil(avgPerDay * safetyFactor),50);
            
            const updated = await medicineModel.findOneAndUpdate(
            { medicineCode, shopCode },
            { $set: { thresholdValue: newThreshold } },
            { new: true }
            );
    
            if (updated) {
            updatedMedicines.push(updated);
            }
        }
    
        return res.status(200).json({
            success: true,
            message: "Threshold values calculated and updated successfully",
            updatedMedicines
        });
  
    } catch (error) {
        console.error("Error calculating threshold:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
  };
const getLowStockMedicines = async (req, res) => {
    try {
        const { shopCode } = req.body;

        if (!shopCode) {
            return res.status(400).json({
            success: false,
            message: "Shop code is required. Please check it."
            });
        }

        const lowStockMedicines = await medicineModel.find({
            shopCode,
            $expr: { $lt: ["$totalQuantity", "$thresholdValue"] }
        });

        return res.status(200).json({
            success: true,
            message: "Low stock medicines fetched successfully",
            medicines: lowStockMedicines
        });
  
    } catch (error) {
        console.error("Error in getLowStockMedicines:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
  };

const showAllMedicines = async (req, res) => {
    try {
      const { shopCode } = req.body;
  
      if (!shopCode) {
        return res.status(400).json({
          success: false,
          message: "Shop code is required",
        });
      }
  
      const shopExists = await ownerModel.findOne({ shopCode });
  
      if (!shopExists) {
        return res.status(404).json({
          success: false,
          message: "Shop not found. Invalid shop code.",
        });
      }
  
     
      const medicines = await medicineModel.find({ shopCode });
  
      if (!medicines || medicines.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No medicines found for this shop.",
        });
      }

      return res.status(200).json({
        success: true,
        medicines,
      });
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching medicines",
        error: error.message,
      });
    }
  };

const getAvailableMedicines = async (req, res) => {
  try {
    const { shopCode } = req.body;

    if (!shopCode) {
      return res.status(400).json({
        success: false,
        message: "Shop code is required",
      });
    }

    const shopExists = await ownerModel.findOne({ shopCode });

    if (!shopExists) {
      return res.status(404).json({
        success: false,
        message: "Shop not found. Invalid shop code.",
      });
    }


    const medicines = await medicineModel.find({
      shopCode,
      totalQuantity: { $gt: 0 },
    });


    return res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });


  } catch (error) {
    console.error("Error fetching available medicines:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching available medicines",
      error: error.message,
    });
  }
};

  
  
export { getAvailableMedicines, addMedicine, showAllMedicines, calculateThreshold, deleteMedicine, updateRackCode, updateUnitSellingPrice,  updateUnitCostPrice, getLowStockMedicines};
