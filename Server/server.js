import express from 'express'
import cors from "cors"
import dotenv from "dotenv";
import { connectDB } from './Config/mongodb.js';

import ownerModel from './Models/ownerModel.js';
import vendorModel from './Models/vendorModel.js';
import staffModel from './Models/staffModel.js';
import rackModel from './Models/rackModel.js';

import ownerRouter from './Routes/ownerRoutes.js';
import staffRouter from './Routes/staffRoutes.js';
import vendorRouter from './Routes/vendorRoutes.js';
import rackRouter from './Routes/rackRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

await connectDB()

app.use('/api/owner',ownerRouter);
app.use('/api/staff',staffRouter);
app.use('/api/rack',rackRouter)
app.use('/api/vendor',vendorRouter)
app.listen(PORT , () => {
    console.log("Server is running at port" + PORT);
})
