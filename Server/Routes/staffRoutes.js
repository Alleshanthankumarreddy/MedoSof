import express from "express"
import { signin, signup } from "../Controllers/staffController.js";

const staffRouter = express.Router();

staffRouter.post('/signup',signup)
staffRouter.post('/signin',signin)

export default staffRouter