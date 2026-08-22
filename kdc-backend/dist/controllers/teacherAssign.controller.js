import { createTeacherAssignment, updateTeacherAssignment, getTeacherAssignments, deleteTeacherAssignment, } from "../services/assignTeacher.servive.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createTeacherAssignCtr = catchAsync(async (req, res, next) => {
    const data = await createTeacherAssignment(req.body);
    if (!data) {
        return next(new AppError('Assignment Failed', 403));
    }
    return res.status(201).json({
        status: 'Success',
        message: 'Teacher Assignment Successfull',
    });
});
export const updateTeacherAssignmentCtrl = catchAsync(async (req, res, next) => {
    const data = await updateTeacherAssignment(req.params.id, req.body);
    if (!data) {
        return next(new AppError('Data update failed', 403));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getTeacherAssignmentsCtr = catchAsync(async (req, res, next) => {
    const enteredData = {
        userId: req.user.id,
        userRole: req.user.role,
    };
    const data = await getTeacherAssignments(enteredData, req.query);
    if (!data || data.length == 0) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const deleteTeacherAssignmentCtr = catchAsync(async (req, res, next) => {
    const data = await deleteTeacherAssignment(req.params.id);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        message: 'Data deleted successfully',
    });
});
//# sourceMappingURL=teacherAssign.controller.js.map