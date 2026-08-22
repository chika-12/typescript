import TimeTable from "../models/timeTable.js";
import { Exam } from "../models/examModels.js";
import AppError from "../utils/appError.js";
export const createTimeTable = async (data) => {
    const { startTime, exam } = data;
    const examdata = await Exam.findOne({ _id: exam });
    if (!examdata) {
        throw new AppError('Exam has not been set by teacher', 404);
    }
    const duration = examdata.duration;
    if (!duration || duration <= 0) {
        throw new AppError('Exam duration must be set by teacher', 400);
    }
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const entryData = await TimeTable.create({
        exam: exam,
        startTime,
        endTime,
    });
    return await TimeTable.findById(entryData._id).populate('exam');
};
export const getTimetables = async (filters) => {
    const query = {};
    if (filters?.status)
        query.status = filters.status;
    if (filters?.exam)
        query.exam = filters.exam;
    return await TimeTable.find(query).populate('exam');
};
export const updateTimeTable = async (id, data) => {
    const databaseReturnValues = await TimeTable.findOne({ _id: id });
    if (!databaseReturnValues) {
        throw new AppError('Data not found', 404);
    }
    if (databaseReturnValues.status === 'active' ||
        databaseReturnValues.status === 'closed') {
        throw new AppError('This time table can not be updated', 403);
    }
    if (data.startTime !== undefined) {
        databaseReturnValues.startTime = data.startTime;
        const examdata = await Exam.findOne({ _id: databaseReturnValues.exam });
        if (!examdata) {
            throw new AppError('Exam not found', 404);
        }
        const duration = examdata.duration;
        if (data.startTime !== undefined) {
            databaseReturnValues.endTime = new Date(data.startTime.getTime() + duration * 60000);
        }
        await databaseReturnValues.save();
    }
    return databaseReturnValues;
};
export const deleteExamTimeTable = async (id) => {
    const data = await TimeTable.findOne({ _id: id });
    console.log('Delete', data);
    if (!data) {
        throw new AppError('Data not found', 404);
    }
    if (data.status === 'active' || data.status === 'closed') {
        throw new AppError('This timetable cannot be deleted', 403);
    }
    await TimeTable.findByIdAndDelete(id);
    return data;
};
//# sourceMappingURL=timeTable.service.js.map