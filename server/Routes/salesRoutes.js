import express from "express"
import { addSales, getLastWeekSales } from "../Controllers/salesController.js"
import auth from "../Middelwares/auth.js";
const salesRouter = express.Router()

salesRouter.post("/addSales",auth,addSales);
salesRouter.get("/getLastWeekSales",auth,getLastWeekSales);

export default salesRouter