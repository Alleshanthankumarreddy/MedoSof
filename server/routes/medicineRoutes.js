import express from 'express'
import { addMedicine } from '../controllers/medicineController.js'

const medicineRouter = express.Router()

medicineRouter.post('/addMedicine',addMedicine)

export default medicineRouter