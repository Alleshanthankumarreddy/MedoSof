import express from "express"
import { getAllStaff, removeStaff, signin, signup } from "../Controllers/staffController.js";
import auth from "../Middelwares/auth.js"

const staffRouter = express.Router();

staffRouter.post('/signup',signup);
staffRouter.post('/signin',signin);
staffRouter.get('/getAllStaff/:shopCode',auth,getAllStaff);
staffRouter.delete('/removeStaff',auth,removeStaff);

export default staffRouter