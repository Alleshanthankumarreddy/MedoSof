import express from "express"
import { addSales } from "../Controllers/salesController.js"
import auth from "../Middelwares/auth.js";
const salesRouter = express.Router()

salesRouter.post("/addSales",auth,addSales);

export default salesRouter