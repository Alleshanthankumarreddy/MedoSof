import express from "express";
import { addMedicine, showAllMedicines, calculateThreshold, deleteMedicine, getLowStockMedicines, updateRackCode, updateUnitCostPrice, updateUnitSellingPrice, getAvailableMedicines } from "../Controllers/medicineController.js";
import auth from "../Middelwares/auth.js";

const medicineRouter = express.Router();

medicineRouter.post('/addMedicine',auth,addMedicine);
medicineRouter.delete('/deleteMedicine',auth,deleteMedicine);
medicineRouter.patch('/updateRackCode',auth,updateRackCode);
medicineRouter.patch('/updateUnitSellingPrice',auth,updateUnitSellingPrice);
medicineRouter.patch('/updateUnitCostPrice',auth,updateUnitCostPrice);
medicineRouter.patch('/calculateThreshold',auth,calculateThreshold);
medicineRouter.post('/getLowStockMedicines',auth,getLowStockMedicines);
medicineRouter.post('/getAllMedicines', auth, showAllMedicines);
medicineRouter.post('/getAvailableMedicines',auth, getAvailableMedicines);

export default medicineRouter