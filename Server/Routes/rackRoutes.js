import express from "express" 
import { addRack, deleteRack } from "../Controllers/rackController.js";

const rackRouter = express.Router();

rackRouter.post('/addRack',addRack);
rackRouter.delete('/deleteRack',deleteRack);

export default rackRouter;
