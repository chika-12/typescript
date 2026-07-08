import express from 'express';
import {
  startExamCtr,
  submitExamCtr,
  getExamSessionCtr,
  getExamSessionByIdCtr,
} from '../controllers/examSession.controller.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';
import { submitExamSessionSchema } from '../validators/startExamSession.validator.ts';
import { validate } from '../middleware/zodSchemaVerifier.middleware.ts';
const examSessionRouter = express.Router({ mergeParams: true });

examSessionRouter.use(protect);
examSessionRouter
  .route('/submit/:examSessionId')
  .post(
    restrictTo('student'),
    validate(submitExamSessionSchema),
    submitExamCtr,
  );
examSessionRouter.route('/session/:sessionId').get(getExamSessionByIdCtr);
examSessionRouter.route('/:examId').get(getExamSessionCtr);
examSessionRouter.route('/:examId').post(restrictTo('student'), startExamCtr);

export default examSessionRouter;
