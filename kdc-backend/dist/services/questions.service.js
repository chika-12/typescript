import { Exam } from "../models/examModels.js";
import AppError from "../utils/appError.js";
import { Question } from "../models/questions.js";
import TeacherAssign from "../models/teacherAssignment.js";
import TimeTable from "../models/timeTable.js";
import { Student } from "../models/studentModel.js";
import mongoose from 'mongoose';
export const createQuestion = async function (data, userId) {
    const { questionText, options, correctAnswer, exam } = data;
    const examCheck = await Exam.findById(exam);
    if (!examCheck) {
        throw new AppError('Exam does not exist', 404);
    }
    const assignedTeacher = await TeacherAssign.findById(examCheck.assignedTeacher);
    if (!assignedTeacher) {
        throw new AppError('Teacher assignment not found', 404);
    }
    if (assignedTeacher.teacher.toString() !== userId) {
        throw new AppError('You are not permitted to create this questions', 403);
    }
    const timeTableExists = await TimeTable.findOne({ exam: exam });
    if (timeTableExists) {
        throw new AppError('Cannot add questions to exam with scheduled timetable', 409);
    }
    const questionCheck = await Question.findOne({
        exam: new mongoose.Types.ObjectId(exam),
        questionText: data.questionText.trim(),
    }).collation({ locale: 'en', strength: 2 });
    if (questionCheck) {
        throw new AppError('This question already exists', 409);
    }
    const question = await Question.create({
        questionText,
        options,
        exam,
        correctAnswer,
    });
    return await Question.findById(question._id).populate('exam');
};
export const updateQuestion = async function (id, userId, data) {
    const question = await Question.findById(id);
    if (!question) {
        throw new AppError('Question does not exist', 404);
    }
    const examCheck = await Exam.findById(question.exam);
    if (!examCheck) {
        throw new AppError('Exam does not exist', 404);
    }
    const assignedTeacher = await TeacherAssign.findById(examCheck.assignedTeacher);
    if (!assignedTeacher) {
        throw new AppError('Teacher assignment not found', 404);
    }
    if (assignedTeacher.teacher.toString() !== userId) {
        throw new AppError('You are not permitted to update this questions', 403);
    }
    const timeTable = await TimeTable.findOne({ exam: question.exam });
    if (timeTable) {
        throw new AppError('Can not update question with schedule time table', 409);
    }
    if (data.correctAnswer !== undefined)
        question.correctAnswer = data.correctAnswer;
    if (data.questionText !== undefined)
        question.questionText = data.questionText;
    if (data.options !== undefined)
        question.options = data.options;
    await question.save();
    return await Question.findById(question._id).populate('exam');
};
export const getQuestions = async function (userRole, exam, userId) {
    const data = await Question.find({ exam: exam });
    const examRecord = await Exam.findById(exam);
    if (!examRecord) {
        throw new AppError('Exam not found', 404);
    }
    if (data.length === 0) {
        throw new AppError('Question not found', 404);
    }
    if (userRole === 'student') {
        const timeTable = await TimeTable.findOne({ exam: exam });
        const student = await Student.findById(userId);
        if (!student || student.class !== examRecord.class) {
            throw new AppError('This exam is not for your class', 404);
        }
        if (!timeTable || timeTable.status !== 'active') {
            throw new AppError('Exam is not currently active', 403);
        }
        if (!examRecord.isReleased) {
            throw new AppError('Exam has not been released', 403);
        }
        return data.map((q) => {
            const obj = q.toObject();
            const { correctAnswer, ...rest } = obj;
            return rest;
        });
    }
    else if (userRole === 'admin' || userRole === 'teacher') {
        return data;
    }
};
export const deleteExamQuestion = async function (id, userId) {
    const question = await Question.findOne({ _id: id }).populate({
        path: 'exam',
        populate: {
            path: 'assignedTeacher',
        },
    });
    if (!question) {
        throw new AppError('Question not found', 404);
    }
    const assignedTeacher = question.exam.assignedTeacher;
    if (!assignedTeacher) {
        throw new AppError('TeacherAssignment not found', 500);
    }
    if (assignedTeacher.teacher.toString() !== userId) {
        throw new AppError('You dont have permission to delete this question', 403);
    }
    const timeTableExists = await TimeTable.findOne({ exam: question.exam });
    if (timeTableExists) {
        throw new AppError('Cannot delete question with scheduled timetable', 409);
    }
    const deleted = await Question.findByIdAndDelete(id);
    return deleted;
};
//# sourceMappingURL=questions.service.js.map