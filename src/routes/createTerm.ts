import express from 'express';
const termRoute = express.Router();
import { createTermController } from '../controllers/adminTermController.ts';

termRoute.post('/', createTermController);
export default termRoute;
