import express from "express" 
import { addPurchase } from "../Controllers/purchaseController.js"
import auth from "../Middelwares/auth.js";

const purchaseRouter = express.Router()

purchaseRouter.post('/addPurchase',auth,addPurchase);

export default purchaseRouter