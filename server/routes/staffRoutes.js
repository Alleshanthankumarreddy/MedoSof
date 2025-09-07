import express from 'express'
import { login, register } from '../controllers/staffController.js';

const staffRouter = express.Router();

staffRouter.post('/register',register)
staffRouter.post('/login',login)

export default staffRouter