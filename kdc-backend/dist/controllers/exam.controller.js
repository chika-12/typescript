import { createExam, getExams, updateExam, deleteExam, getExamsById, } from "../services/exam.service.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createExamCtr = catchAsync(async (req, res, next) => {
    const data = await createExam(req.user.id, req.body);
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const getExamsCtr = catchAsync(async (req, res, next) => {
    const data = await getExams(req.user.id, req.user.role, req.query);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const updateExamCtr = catchAsync(async (req, res, next) => {
    const data = await updateExam(req.params.id, req.user.id, req.body);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getExamsByIdCtr = catchAsync(async (req, res, next) => {
    const data = await getExamsById(req.params.id, req.user.id, req.user.role);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const deleteExamCtr = catchAsync(async (req, res, next) => {
    const data = await deleteExam(req.params.id, req.user.id);
    return res.status(200).json({
        status: 'Success',
        message: 'Data deleted',
        data,
    });
});
//# sourceMappingURL=exam.controller.js.map