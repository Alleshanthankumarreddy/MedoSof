import ownerModel from "../Models/ownerModel.js";
import rackModel from "../Models/rackModel.js"; 

const addRack = async (req, res) => {
    try {
        const { rackCode, shopCode, position } = req.body;

        if (!rackCode || !shopCode || !position) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        const existingRack = await rackModel.findOne({ rackCode, shopCode });
        
        if (existingRack) {
            return res.status(400).json({ success: false, message: "Rack already exists in this shop" });
        }

        const exisitingShopCode = await ownerModel.findOne({shopCode});

        if(!exisitingShopCode) {
            return res.status(400).json({ success: false, message: "Check the shop code correctly,Shop code does not exists" });          
        }

        const newRack = new rackModel({
            rackCode,
            shopCode,
            position
        });

        const rack = await newRack.save();

        res.status(201).json({ success: true, message: "Rack added successfully", rack: newRack });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
const deleteRack = async (req, res) => {
    try {
        const { rackCode, shopCode } = req.body;

        if (!rackCode || !shopCode) {
            return res.status(400).json({ success: false, message: "Missing rackCode or shopCode" });
        }
        
        const exisitingShopCode = await ownerModel.findOne({shopCode});

        if(!exisitingShopCode) {
            return res.status(400).json({ success: false, message: "Check the shop code correctly,Shop code does not exists" });          
        }

        const deletedRack = await rackModel.findOneAndDelete({ rackCode, shopCode });

        if (!deletedRack) {
            return res.status(404).json({ success: false, message: "Rack not found" });
        }

        res.status(200).json({ success: true, message: "Rack deleted successfully", rack: deletedRack });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


export { addRack,deleteRack };
