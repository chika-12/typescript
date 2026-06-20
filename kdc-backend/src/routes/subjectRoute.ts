import express from 'express';
const subjectRouter = express.Router();
import {
  createSubjectController,
  updateSubjectController,
  allSubject,
} from '../controllers/subjectControllers.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';

subjectRouter.use(protect);
subjectRouter.get('/', allSubject);
subjectRouter.post(
  '/',
  restrictTo('admin', 'superAdmin'),
  createSubjectController,
);
subjectRouter.put(
  '/:id',
  restrictTo('admin', 'superAdmin'),
  updateSubjectController,
);

export default subjectRouter;
