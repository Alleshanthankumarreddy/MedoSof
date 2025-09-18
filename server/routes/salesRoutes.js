import express from 'express' 
import { GenerateReceipt } from '../controllers/salesController.js'

const salesRouter = express.Router()

salesRouter.get('/generate-receipt',GenerateReceipt)

export default salesRouter