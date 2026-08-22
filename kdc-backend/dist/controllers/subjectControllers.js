import { createSubject, updateSubject, getSubjects, } from "../services/subjectService.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createSubjectController = catchAsync(async (req, res, next) => {
    const data = req.body;
    if (!data.name || !data.code) {
        return next(new AppError('Add subject name and subject code', 400));
    }
    const subject = await createSubject(data);
    return res.status(201).json({
        status: 'Success',
        message: `${subject.name} has been added to subject collection`,
    });
});
export const updateSubjectController = catchAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;
    const subUpdate = await updateSubject(id, data);
    return res.status(200).json({
        status: 'Success',
        message: `${subUpdate.name} has been successfully updated`,
    });
});
export const allSubject = catchAsync(async (req, res, next) => {
    const data = await getSubjects(req.user.role);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//# sourceMappingURL=subjectControllers.js.map