import express from 'express' 
import { addRack } from '../controllers/rackController.js'

const rackRouter = express.Router()

rackRouter.post('/addRack',addRack)

export default rackRouter