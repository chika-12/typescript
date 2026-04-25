import express from 'express';
const resultRouter = express.Router();
import { getResult } from '../controllers/resultController.ts';

resultRouter.get('/result', getResult);
export default resultRouter;
