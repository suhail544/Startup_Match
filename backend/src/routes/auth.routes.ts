import express from 'express'
import * as authController from '../controllers/auth.controller'
const authRoute = express.Router()

authRoute.get('/', authController.getAllUsers) 
authRoute.post('/signup', authController.signUp) 
authRoute.post('/login', authController.login) 

export default authRoute