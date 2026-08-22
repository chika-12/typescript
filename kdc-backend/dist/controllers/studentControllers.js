import { createStudent, serachAllStudent, searchStudents, searchStudentById, searchStudentByStudentId, updateStudent, } from "../services/createStudentServices.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createStudentController = catchAsync(async (req, res, next) => {
    const data = await createStudent(req.body);
    if (!data) {
        return next(new AppError('Student not created', 403));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const searchStudentByStudentIdController = catchAsync(async (req, res, next) => {
    const data = searchStudentByStudentId(req.body.studentId);
    if (!data) {
        return next(new AppError('Student not fount', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const searchStudentByIdController = catchAsync(async (req, res, next) => {
    const data = searchStudentById(req.params.id);
    if (!data) {
        return next(new AppError('Student not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const updateStudentController = catchAsync(async (req, res, next) => {
    const data = await updateStudent(req.params.id, req.body);
    if (!data) {
        return next(new AppError('Update failed', 403));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const serachAllStudentController = catchAsync(async (req, res, next) => {
    const data = await serachAllStudent();
    if (data.length === 0) {
        return next(new AppError('No student found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//Natural Language Controller
export const searchStudentsController = catchAsync(async (req, res, next) => {
    const query = req.query.q;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    if (!query) {
        return next(new AppError('Search query is required', 400));
    }
    const data = await searchStudents(query, page, limit);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//# sourceMappingURL=studentControllers.js.map