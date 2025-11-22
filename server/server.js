import express from 'express'
import cors from "cors"
import dotenv from "dotenv";
import { connectDB } from './Config/mongodb.js';

import ownerModel from './Models/ownerModel.js';
import vendorModel from './Models/vendorModel.js';
import staffModel from './Models/staffModel.js';
import rackModel from './Models/rackModel.js';
import medicineModel from './Models/medicineModel.js';
import salesModel from './Models/salesModel.js';
import purchaseModel from './Models/purchaseModel.js';
import batchModel from './Models/batchModel.js';
import customerModel from './Models/customerModel.js';

import ownerRouter from './Routes/ownerRoutes.js';
import staffRouter from './Routes/staffRoutes.js';
import vendorRouter from './Routes/vendorRoutes.js';
import rackRouter from './Routes/rackRoutes.js';
import medicineRouter from './Routes/medicineRoutes.js';
import salesRouter from './Routes/salesRoutes.js';
import purchaseRouter from './Routes/purchaseRoutes.js';
import batchRouter from './Routes/batchRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

await connectDB();

app.use('/api/owner',ownerRouter);
app.use('/api/staff',staffRouter);
app.use('/api/rack',rackRouter);
app.use('/api/vendor',vendorRouter);
app.use('/api/medicine',medicineRouter);
app.use('/api/sales',salesRouter);
app.use('/api/batch',batchRouter);
app.use('/api/purchase',purchaseRouter);

app.listen(PORT , () => {
    console.log("Server is running at port" + PORT);
})