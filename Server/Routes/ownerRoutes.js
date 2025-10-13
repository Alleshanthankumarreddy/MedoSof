import express from "express"
import { signin, signup } from "../Controllers/ownerController.js";

const ownerRouter = express.Router();

ownerRouter.post('/signup',signup)
ownerRouter.post('/signin',signin)

export default ownerRouter