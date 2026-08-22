import express from 'express';
import { createQuestionCtr, getQuestionsCtr, updateQuestionCtr, deleteQuestionCtr, } from "../controllers/question.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/zodSchemaVerifier.middleware.js";
import { questionsSchema } from "../validators/questions.validator.js";
import { updateQuestionSchema } from "../validators/updateQuestion.validator.js";
const questionRouter = express.Router({ mergeParams: true });
questionRouter.use(protect);
questionRouter
    .route('/questions')
    .post(restrictTo('teacher'), validate(questionsSchema), createQuestionCtr);
questionRouter.route('/questions').get(getQuestionsCtr);
questionRouter
    .route('/questions/:id')
    .patch(restrictTo('teacher'), validate(updateQuestionSchema), updateQuestionCtr)
    .delete(restrictTo('teacher'), deleteQuestionCtr);
export default questionRouter;
//# sourceMappingURL=question.route.js.map