import express from 'express'
import { addBatch } from '../controllers/batchController.js';

const batchRouter = express.Router()

batchRouter.post('/addBatch',addBatch)

export default batchRouter;