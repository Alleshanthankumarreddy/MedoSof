import express from "express" 
import { addRack, deleteRack, showAllRacks } from "../Controllers/rackController.js";
import auth from "../Middelwares/auth.js";

const rackRouter = express.Router();

rackRouter.post('/addRack',auth,addRack);
rackRouter.delete('/deleteRack',auth,deleteRack);
rackRouter.post('/showAllRacks',auth,showAllRacks);

export default rackRouter;
