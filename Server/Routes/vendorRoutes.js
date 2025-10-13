import express from "express";
import { addVendor, updateVendorContact } from "../Controllers/vendorController.js";

const vendorRouter = express.Router();

vendorRouter.post('/addVendor',addVendor);
vendorRouter.patch('/updateVendorContact',updateVendorContact);

export default vendorRouter;