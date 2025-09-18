import express from 'express'
import { addVendor } from '../controllers/vendorController.js';

const vendorRouter = express.Router();

vendorRouter.post('/addVendor',addVendor)

export default vendorRouter;