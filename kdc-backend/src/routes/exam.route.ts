import express from 'express';
import {
  createExamCtr,
  getExamsCtr,
  updateExamCtr,
  getExamsByIdCtr,
  deleteExamCtr,
} from '../controllers/exam.controller.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';
import { validate } from '../middleware/zodSchemaVerifier.middleware.ts';
import { examSchema } from '../validators/examValidator.ts';
import { updateExamSchema } from '../validators/updateExam.ts';
const examRouter = express.Router();

examRouter.use(protect);

examRouter.post(
  '/',
  restrictTo('teacher'),
  validate(examSchema),
  createExamCtr,
);
examRouter.get('/', getExamsCtr);
examRouter.get('/:id', getExamsByIdCtr);
examRouter.put(
  '/:id',
  restrictTo('teacher'),
  validate(updateExamSchema),
  updateExamCtr,
);
examRouter.delete('/:id', restrictTo('teacher'), deleteExamCtr);

export default examRouter;
