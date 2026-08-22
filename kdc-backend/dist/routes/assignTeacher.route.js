import express from 'express';
import { createTeacherAssignCtr, updateTeacherAssignmentCtrl, getTeacherAssignmentsCtr, deleteTeacherAssignmentCtr, } from "../controllers/teacherAssign.controller.js";
const teacherAssingRouter = express.Router();
import { protect, restrictTo } from "../middleware/authMiddleware.js";
teacherAssingRouter.use(protect);
teacherAssingRouter.post('/', restrictTo('admin', 'superAdmin'), createTeacherAssignCtr);
teacherAssingRouter.get('/', getTeacherAssignmentsCtr);
teacherAssingRouter.put('/:id', restrictTo('admin', 'superAdmin'), updateTeacherAssignmentCtrl);
teacherAssingRouter.delete('/:id', restrictTo('admin', 'superAdmin'), deleteTeacherAssignmentCtr);
export default teacherAssingRouter;
//# sourceMappingURL=assignTeacher.route.js.map