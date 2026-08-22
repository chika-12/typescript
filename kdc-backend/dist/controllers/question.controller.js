import { createQuestion, updateQuestion, getQuestions, deleteExamQuestion, } from "../services/questions.service.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createQuestionCtr = catchAsync(async (req, res, next) => {
    const data = await createQuestion(req.body, req.user.id);
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const updateQuestionCtr = catchAsync(async (req, res, next) => {
    const data = await updateQuestion(req.params.id, req.user.id, req.body);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const getQuestionsCtr = catchAsync(async (req, res, next) => {
    const data = await getQuestions(req.user.role, req.params.examId, req.user.id);
    return res.status(200).json({
        status: 'Success',
        NumberOfQuestions: data?.length ?? 0,
        data,
    });
});
export const deleteQuestionCtr = catchAsync(async (req, res, next) => {
    await deleteExamQuestion(req.params.id, req.user.id);
    return res.status(200).json({
        status: 'Success',
        message: 'Question deleted successfully',
    });
});
//# sourceMappingURL=question.controller.js.map