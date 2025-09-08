import express from 'express'
import { addStaff, login } from '../controllers/ownerController.js'

const ownerRouter = new express.Router()

ownerRouter.post('/login',login)
ownerRouter.post('/addStaff',addStaff)

export default ownerRouter