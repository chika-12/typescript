import express from 'express';
import { createStudentController, searchStudentsController, serachAllStudentController, updateStudentController, searchStudentByStudentIdController, searchStudentByIdController, } from "../controllers/studentControllers.js";
const studentRoute = express.Router();
studentRoute.get('/search', searchStudentsController);
studentRoute.get('/findByStudentId', searchStudentByStudentIdController);
studentRoute.post('/register', createStudentController);
studentRoute.get('/find/all-students', serachAllStudentController);
studentRoute.put('/update/:id', updateStudentController);
studentRoute.get('/:id', searchStudentByIdController);
export default studentRoute;
//# sourceMappingURL=studentRoute.js.map