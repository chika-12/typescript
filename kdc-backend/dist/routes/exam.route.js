import express from 'express';
import { createExamCtr, getExamsCtr, updateExamCtr, getExamsByIdCtr, deleteExamCtr, } from "../controllers/exam.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/zodSchemaVerifier.middleware.js";
import { examSchema } from "../validators/examValidator.js";
import { updateExamSchema } from "../validators/updateExam.js";
const examRouter = express.Router();
examRouter.use(protect);
examRouter.post('/', restrictTo('teacher'), validate(examSchema), createExamCtr);
examRouter.get('/', getExamsCtr);
examRouter.get('/:id', getExamsByIdCtr);
examRouter.put('/:id', restrictTo('teacher'), validate(updateExamSchema), updateExamCtr);
examRouter.delete('/:id', restrictTo('teacher'), deleteExamCtr);
export default examRouter;
//# sourceMappingURL=exam.route.js.map