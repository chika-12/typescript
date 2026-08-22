import express from 'express';
import { createTimeTableCtr, updateTimeTableCtrl, getTimetablesCtr, deleteExamTimeTableCtr, } from "../controllers/timeTable.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { timeTableSchema } from "../validators/timeTableValidator.js";
import { validate } from "../middleware/zodSchemaVerifier.middleware.js";
const timeTableRouter = express.Router();
timeTableRouter.use(protect);
timeTableRouter.post('/', restrictTo('admin', 'superAdmin'), validate(timeTableSchema), createTimeTableCtr);
timeTableRouter.get('/', getTimetablesCtr);
timeTableRouter.put('/:id', restrictTo('admin', 'superAdmin'), validate(timeTableSchema), updateTimeTableCtrl);
timeTableRouter.delete('/:id', restrictTo('admin', 'superAdmin'), deleteExamTimeTableCtr);
export default timeTableRouter;
//# sourceMappingURL=timeTable.route.js.map