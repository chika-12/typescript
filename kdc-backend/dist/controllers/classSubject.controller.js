import { createClassSubject, addSubjectToClass, removeSubject, getAllSubjects, deleteClassSubject, } from "../services/classService.service.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
const normalization = function (subject) {
    const name = subject.split(' ');
    const newName = name.map((word) => {
        const firstChar = word.slice(0, 1);
        return firstChar.toUpperCase() + word.slice(1).toLocaleLowerCase();
    });
    return newName.join(' ');
};
export const createClassSubjectCtrl = catchAsync(async function (req, res, next) {
    const data = await createClassSubject(req.body);
    if (!data) {
        return next(new AppError('Class not created', 403));
    }
    return res.status(201).json({
        status: 'Success',
        message: ` Class subject has been created successfully`,
    });
});
export const addSubjectToClassCtrl = catchAsync(async function (req, res, next) {
    const subjects = normalization(req.body.subjects);
    const data = await addSubjectToClass(req.params.id, subjects);
    if (!data) {
        return next(new AppError('Subject addition failed', 403));
    }
    return res.status(201).json({
        status: 'Success',
        message: 'Subject added successfully',
    });
});
export const removeSubjectCtrl = catchAsync(async function (req, res, next) {
    const data = await removeSubject(req.params.id, req.body.subjects);
    if (!data) {
        return next(new AppError('Removal failed', 403));
    }
    return res.status(200).json({
        status: 'Success',
        message: 'Subject removed successfully',
    });
});
export const getAllSubjectsCtrl = catchAsync(async function (req, res, next) {
    const data = await getAllSubjects(req.query);
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const deleteClassSubjectCtrl = catchAsync(async function (req, res, next) {
    const data = await deleteClassSubject(req.params.id);
    return res.status(200).json({
        status: 'Success',
    });
});
//# sourceMappingURL=classSubject.controller.js.map