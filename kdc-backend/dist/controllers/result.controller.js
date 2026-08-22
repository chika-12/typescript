//import topScorer from '../utils/topscorer.ts';
//import calStudentScore from '../utils/calculateAverage.ts';
import { catchAsync } from "../utils/catchAsync.js";
import { createResultWithWrittenScore, getAllResults, getResultsById, getResultsByStudentId, getBestStudentInSubject, getBestStudentPerSubjectPerClass, } from "../services/result.service.js";
import AppError from "../utils/appError.js";
export const createResultWithWrittenScoreCtr = catchAsync(async (req, res, next) => {
    const data = await createResultWithWrittenScore(req.params.examId, req.body.studentRegNo, req.body.writtenScore, req.user.id, req.body.term, req.body.session);
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const getAllResultsCtr = catchAsync(async (req, res, next) => {
    const data = await getAllResults(req.user.id, req.user.role, req.query.term, req.query.session, req.query.classId);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getResultsByIdCtr = catchAsync(async (req, res, next) => {
    const data = await getResultsById(req.params.resultId, req.user.id, req.user.role);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getResultsByStudentIdCtr = catchAsync(async (req, res, next) => {
    const data = await getResultsByStudentId(req.query.studentId, req.user.id, req.user.role);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getBestStudentInSubjectCtr = catchAsync(async (req, res, next) => {
    const data = await getBestStudentInSubject(req.params.subjectId);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getBestStudentInSubjectByClassCtr = catchAsync(async (req, res, next) => {
    const data = await getBestStudentPerSubjectPerClass(req.params.subjectId, req.params.classId);
    if (!data) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//# sourceMappingURL=result.controller.js.map