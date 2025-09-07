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
import staffRouter from "./routes/staffRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";

const app = express();

app.use(express.json());
app.use(cors())

await connectDB();
console.log(process.env.OWNER_NAME);

const PORT = process.env.PORT || 3000;

app.use('/api/staff',staffRouter)
app.use('/api/owner',ownerRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
