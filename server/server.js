import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from "./config/dataBase.js";

import userRouter from "./routes/staffRoutes.js";
import staffModel from "./models/staffModel.js";
import ownerModel from "./models/ownerModel.js";
import rackModel from "./models/rackModel.js";
import medicineModel from "./models/medicineModel.js"
import medicineBatchModel from "./models/medicineBatchModel.js";
import salesModel from "./models/salesModel.js";
import salesDetailsModel from "./models/salesDetailsModel.js";

import staffRouter from "./routes/staffRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import  medicineRouter  from "./routes/medicineRoutes.js";
import rackRouter from "./routes/rackRouter.js";
import salesRouter from "./routes/salesRoutes.js";

const app = express();

app.use(express.json());
app.use(cors())

await connectDB();

const PORT = process.env.PORT || 3000;

app.use('/api/staff',staffRouter)
app.use('/api/owner',ownerRouter)
app.use('/api/medicine',medicineRouter)
app.use('/api/rack',rackRouter)
app.use('/api/sales',salesRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
