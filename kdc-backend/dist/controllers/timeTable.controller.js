import { createTimeTable, updateTimeTable, getTimetables, deleteExamTimeTable, } from "../services/timeTable.service.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createTimeTableCtr = catchAsync(async (req, res, next) => {
    const data = await createTimeTable(req.body);
    if (!data) {
        return next(new AppError('Time table creation failed', 400));
    }
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const updateTimeTableCtrl = catchAsync(async (req, res, next) => {
    const data = await updateTimeTable(req.params.id, req.body);
    if (!data) {
        return next(new AppError('Update failed', 403));
    }
    return res.status(201).json({
        status: 'Success',
        data,
    });
});
export const getTimetablesCtr = catchAsync(async (req, res, next) => {
    const data = await getTimetables(req.query);
    if (!data || data.length === 0) {
        return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
export const deleteExamTimeTableCtr = catchAsync(async (req, res, next) => {
    const data = await deleteExamTimeTable(req.params.id);
    return res.status(200).json({
        status: 'success',
        data,
    });
});
//# sourceMappingURL=timeTable.controller.js.map