import express from 'express'
import { login } from '../controllers/staffController.js';

const staffRouter = express.Router();

staffRouter.post('/login',login)

export default staffRouter