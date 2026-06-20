import express from 'express';
const classSubjectRouter = express.Router();
import {
  createClassSubjectCtrl,
  addSubjectToClassCtrl,
  removeSubjectCtrl,
  getAllSubjectsCtrl,
  deleteClassSubjectCtrl,
} from '../controllers/classSubject.controller.ts';

import { protect, restrictTo } from '../middleware/authMiddleware.ts';
classSubjectRouter.use(protect);

classSubjectRouter.get(
  '/',
  restrictTo('admin', 'superAdmin'),
  getAllSubjectsCtrl,
);

classSubjectRouter.post(
  '/',
  restrictTo('admin', 'superAdmin'),
  createClassSubjectCtrl,
);
classSubjectRouter.put(
  '/:id/add-subject',
  restrictTo('admin', 'superAdmin'),
  addSubjectToClassCtrl,
);
classSubjectRouter.put(
  '/:id/remove-subject',
  restrictTo('admin', 'superAdmin'),
  removeSubjectCtrl,
);
classSubjectRouter.delete(
  '/:id',
  restrictTo('admin', 'superAdmin'),
  deleteClassSubjectCtrl,
);

export default classSubjectRouter;
