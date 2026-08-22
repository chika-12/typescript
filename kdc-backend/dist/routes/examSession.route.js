import express from 'express';
import { startExamCtr, submitExamCtr, getExamSessionCtr, getExamSessionByIdCtr, } from "../controllers/examSession.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { submitExamSessionSchema } from "../validators/startExamSession.validator.js";
import { validate } from "../middleware/zodSchemaVerifier.middleware.js";
const examSessionRouter = express.Router({ mergeParams: true });
examSessionRouter.use(protect);
examSessionRouter
    .route('/submit/:examSessionId')
    .post(restrictTo('student'), validate(submitExamSessionSchema), submitExamCtr);
examSessionRouter.route('/session/:sessionId').get(getExamSessionByIdCtr);
examSessionRouter.route('/:examId').get(getExamSessionCtr);
examSessionRouter.route('/:examId').post(restrictTo('student'), startExamCtr);
export default examSessionRouter;
//# sourceMappingURL=examSession.route.js.map