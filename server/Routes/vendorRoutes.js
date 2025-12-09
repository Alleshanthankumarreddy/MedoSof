import express from "express";
import { addVendorMedicine, deleteMedicines, listOfMedicinesSupplied, showAllVendors, signin, signup, updateVendorContact } from "../Controllers/vendorController.js";
import auth from "../Middelwares/auth.js";

const vendorRouter = express.Router();

vendorRouter.post('/addVendorMedicine',auth,addVendorMedicine);
vendorRouter.patch('/updateVendorContact',auth,updateVendorContact);
vendorRouter.get('/showAllVendors',auth,showAllVendors);
vendorRouter.post('/signin',signin);
vendorRouter.post('/signup',signup);
vendorRouter.get('/listOfMedicinesSupplied',auth,listOfMedicinesSupplied);
vendorRouter.delete('/deleteMedicines',auth, deleteMedicines)

export default vendorRouter;