import express from 'express';
const resultRouter = express.Router();
import {
  getResult,
  addStudentsResult,
  updateSubjectScoreController,
  addSubjectScoreController,
  getStudentsResultByRegNoController,
  getStudentsResultByIdController,
  getStudentsResultByTermController,
  getBestStudentPerTermController,
  bestStudentOverallSession,
} from '../controllers/resultController.ts';

resultRouter.get('/', getResult);
resultRouter.get('/term', getStudentsResultByTermController);
resultRouter.get('/bestResult', getBestStudentPerTermController);
resultRouter.get('/bestStudent-per-session', bestStudentOverallSession);
resultRouter.post('/', addStudentsResult);
resultRouter.put('/subject-score', updateSubjectScoreController);
resultRouter.put('/add/subject-score', addSubjectScoreController);
resultRouter.get('/id/:id', getStudentsResultByIdController);
resultRouter.get('/:studentId', getStudentsResultByRegNoController);
export default resultRouter;
