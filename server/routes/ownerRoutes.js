import express from 'express'
import { login } from '../controllers/ownerController.js'

const ownerRouter = new express.Router()

ownerRouter.post('/login',login)

export default ownerRouter