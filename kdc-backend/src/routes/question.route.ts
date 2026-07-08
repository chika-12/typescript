import express from 'express';
import {
  createQuestionCtr,
  getQuestionsCtr,
  updateQuestionCtr,
  deleteQuestionCtr,
} from '../controllers/question.controller.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';
import { validate } from '../middleware/zodSchemaVerifier.middleware.ts';
import { questionsSchema } from '../validators/questions.validator.ts';
import { updateQuestionSchema } from '../validators/updateQuestion.validator.ts';

const questionRouter = express.Router({ mergeParams: true });
questionRouter.use(protect);

questionRouter
  .route('/questions')
  .post(restrictTo('teacher'), validate(questionsSchema), createQuestionCtr);

questionRouter.route('/questions').get(getQuestionsCtr);
questionRouter
  .route('/questions/:id')
  .patch(
    restrictTo('teacher'),
    validate(updateQuestionSchema),
    updateQuestionCtr,
  )
  .delete(restrictTo('teacher'), deleteQuestionCtr);

export default questionRouter;
