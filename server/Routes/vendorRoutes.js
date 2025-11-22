import express from "express";
import { addVendor, showAllVendors, updateVendorContact } from "../Controllers/vendorController.js";
import auth from "../Middelwares/auth.js";

const vendorRouter = express.Router();

vendorRouter.post('/addVendor',auth,addVendor);
vendorRouter.patch('/updateVendorContact',auth,updateVendorContact);
vendorRouter.get('/showAllVendors',auth,showAllVendors);

export default vendorRouter;