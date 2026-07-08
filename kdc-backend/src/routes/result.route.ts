import express from 'express';
const resultRouter = express.Router();
import {
  createResultWithWrittenScoreCtr,
  getAllResultsCtr,
  getResultsByIdCtr,
  getResultsByStudentIdCtr,
  getBestStudentInSubjectCtr,
  getBestStudentInSubjectByClassCtr,
} from '../controllers/result.controller.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';
import { createResultSchema } from '../validators/result.validator.ts';
import { validate } from '../middleware/zodSchemaVerifier.middleware.ts';
resultRouter.use(protect);
resultRouter.get(
  '/best-student/:subjectId',
  restrictTo('admin', 'teacher', 'superAdmin'),
  getBestStudentInSubjectCtr,
);
resultRouter.get(
  '/best-student-per-class/:subjectId/:classId',
  restrictTo('admin', 'teacher', 'superAdmin'),
  getBestStudentInSubjectByClassCtr,
);
resultRouter.get('/', getAllResultsCtr);
resultRouter.get('/students', getResultsByStudentIdCtr);
resultRouter.get('/results/:resultId', getResultsByIdCtr);
resultRouter.post(
  '/:examId',
  restrictTo('teacher'),
  validate(createResultSchema),
  createResultWithWrittenScoreCtr,
);

export default resultRouter;
