import express from 'express';
const authRoute = express.Router();
import { login } from '../controllers/authController.ts';
authRoute.post('/login', login);
export default authRoute;
