import express from 'express'
import { ExpiredMedicines, addMedicine, deleteMedicine, searchMedicine, viewAllMedicines } from '../controllers/medicineController.js'

const medicineRouter = express.Router()

medicineRouter.post('/addMedicine',addMedicine)
medicineRouter.get('/viewAllMedicines',viewAllMedicines)
medicineRouter.get('/expiredMedicines',ExpiredMedicines)
medicineRouter.delete('/deleteMedicine',deleteMedicine)
medicineRouter.get('/searchMedicine',searchMedicine)

export default medicineRouter