import express from "express"
import { addBatch, expiredMedicines, removeExpiredMedicines } from "../Controllers/batchController.js"
import auth from "../Middelwares/auth.js";

const batchRouter = express.Router()

batchRouter.post('/addBatch',auth,addBatch);
batchRouter.post('/expiredMedicines',auth,expiredMedicines);
batchRouter.delete('/removeExpiredMedicines',auth,removeExpiredMedicines);

export default batchRouter;