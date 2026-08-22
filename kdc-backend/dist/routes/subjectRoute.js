import express from 'express';
const subjectRouter = express.Router();
import { createSubjectController, updateSubjectController, allSubject, } from "../controllers/subjectControllers.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
subjectRouter.use(protect);
subjectRouter.get('/', allSubject);
subjectRouter.post('/', restrictTo('admin', 'superAdmin'), createSubjectController);
subjectRouter.put('/:id', restrictTo('admin', 'superAdmin'), updateSubjectController);
export default subjectRouter;
//# sourceMappingURL=subjectRoute.js.map