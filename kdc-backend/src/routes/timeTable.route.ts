import express from 'express';
import {
  createTimeTableCtr,
  updateTimeTableCtrl,
  getTimetablesCtr,
  deleteExamTimeTableCtr,
} from '../controllers/timeTable.controller.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';
import { timeTableSchema } from '../validators/timeTableValidator.ts';
import { validate } from '../middleware/zodSchemaVerifier.middleware.ts';
const timeTableRouter = express.Router();
timeTableRouter.use(protect);
timeTableRouter.post(
  '/',
  restrictTo('admin', 'superAdmin'),
  validate(timeTableSchema),
  createTimeTableCtr,
);
timeTableRouter.get('/', getTimetablesCtr);
timeTableRouter.put(
  '/:id',
  restrictTo('admin', 'superAdmin'),
  validate(timeTableSchema),
  updateTimeTableCtrl,
);
timeTableRouter.delete(
  '/:id',
  restrictTo('admin', 'superAdmin'),
  deleteExamTimeTableCtr,
);

export default timeTableRouter;
