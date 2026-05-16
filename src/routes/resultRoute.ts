import express from 'express';
const resultRouter = express.Router();
import { getResult, addStudentsResult } from '../controllers/resultController.ts';

resultRouter.get('/result', getResult);
resultRouter.post('/result', addStudentsResult)
export default resultRouter;
