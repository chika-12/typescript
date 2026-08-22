import { startExam, submitExam, getExamSession, getExamSessionById, } from "../services/examSession.service.js";
import { catchAsync } from "../utils/catchAsync.js";
export const startExamCtr = catchAsync(async (req, res, next) => {
    const data = await startExam(req.params.examId, req.user.id, req.user.role);
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const submitExamCtr = catchAsync(async (req, res, next) => {
    const data = await submitExam(req.params.examSessionId, req.body.answers, req.user.id);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getExamSessionCtr = catchAsync(async (req, res, next) => {
    const data = await getExamSession(req.params.examId, req.user.id, req.user.role);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getExamSessionByIdCtr = catchAsync(async (req, res, next) => {
    const data = await getExamSessionById(req.params.sessionId, req.user.id, req.user.role);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//# sourceMappingURL=examSession.controller.js.map