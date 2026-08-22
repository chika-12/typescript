import { Result } from "../models/resultModel.js";
//import type { CreateScoreInput } from '../interfaces/scoreInput.ts';
import AppError from "../utils/appError.js";
import examFinaliseChecker from "../utils/isFinalizedCheker.js";
import { Term } from "../models/termModel.js";
import { Exam } from "../models/examModels.js";
import TeacherAssign from "../models/teacherAssignment.js";
import { Student } from "../models/studentModel.js";
import ExamSession from "../models/examSession.js";
import { calculateGrade } from "../utils/calculateGrade.js";
import mongoose from 'mongoose';
export const createResultWithWrittenScore = async (examId, studentRegNo, writtenScore, userId, term, session) => {
    await examFinaliseChecker(term, session);
    const exam = await Exam.findById(examId).populate('assignedTeacher');
    if (!exam) {
        throw new AppError('Exam not found', 404);
    }
    if (exam.assignedTeacher.teacher.toString() !== userId) {
        throw new AppError('You are not permited to upload this result', 403);
    }
    const student = await Student.findOne({ studentId: studentRegNo });
    if (!student) {
        throw new AppError(`$${studentRegNo} is not a valid registration number`, 403);
    }
    const examSession = await ExamSession.findOne({
        student: student._id,
        exam: examId,
    });
    if (!examSession || examSession.status !== 'submitted') {
        throw new AppError('Student has not completed the CBT for this exam. A Result cannot be created until the CBT is submitted.', 400);
    }
    const resultCheck = await Result.findOne({
        student: student.id,
        exam: examId,
    });
    if (resultCheck) {
        throw new AppError('This exam has been created already try update', 409);
    }
    const cbt = examSession.cbtScore;
    if (cbt === null || cbt === undefined) {
        throw new AppError('cbt not available', 400); // just been defensive
    }
    const finalScore = (cbt + writtenScore) / 2;
    const grade = calculateGrade(finalScore);
    const result = await Result.create({
        exam: examId,
        student: student.id,
        cbtScore: cbt,
        writtenScore: writtenScore,
        finalScore: finalScore,
        grade: grade,
    });
    const returnData = await Result.findById(result._id);
    return returnData;
};
export const getAllResults = async (userId, userRole, term, session, classId) => {
    //TODO pagination and limit
    let query = {};
    if (userRole === 'student') {
        query.student = userId;
    }
    else if (userRole === 'teacher') {
        const teacherAssignments = await TeacherAssign.find({ teacher: userId });
        const assignmentIds = teacherAssignments.map((ta) => ta._id);
        const teacherExams = await Exam.find({
            assignedTeacher: { $in: assignmentIds },
        });
        query.exam = { $in: teacherExams.map((e) => e._id) };
    }
    if (userRole === 'admin' || userRole === 'superAdmin') {
        if ((term && !session) || (!term && session)) {
            throw new AppError('term and session must both be provided together', 400);
        }
        if (term && session) {
            const termDoc = await Term.findOne({ term, session });
            if (!termDoc)
                throw new AppError('Term not found for that session', 404);
            const examFilter = { term: termDoc._id };
            if (classId)
                examFilter.class = classId;
            const qualifyingExams = await Exam.find(examFilter).select('_id');
            query.exam = { $in: qualifyingExams.map((e) => e._id) };
        }
    }
    const results = await Result.find(query).populate(['student', 'exam']);
    return results;
};
export const getResultsById = async (resultId, userId, userRole) => {
    const data = await Result.findById(resultId).populate([
        'student',
        {
            path: 'exam',
            populate: { path: 'assignedTeacher' },
        },
    ]);
    if (!data) {
        throw new AppError('Result not found', 404);
    }
    if (userRole === 'student') {
        if (data.student._id.toString() !== userId) {
            throw new AppError('You are not permited to view this result', 403);
        }
    }
    else if (userRole === 'teacher') {
        const assignedTeacher = data.exam.assignedTeacher;
        if (assignedTeacher.teacher.toString() !== userId) {
            throw new AppError('You are not permited to view this result', 403);
        }
    }
    return data;
};
export const getResultsByStudentId = async (studentId, userId, userRole) => {
    const data = await Student.findOne({ studentId: studentId });
    if (!data) {
        throw new AppError('Student not found', 404);
    }
    if (userId !== data._id.toString() &&
        userRole !== 'teacher' &&
        userRole !== 'admin' &&
        userRole !== 'superAdmin') {
        throw new AppError('You are not permited to view this result', 403);
    }
    const results = await Result.find({ student: data._id }).populate([
        'student',
        'exam',
    ]);
    return results;
};
export const getBestStudentInSubject = async (subjectId) => {
    const result = await Result.aggregate([
        {
            $lookup: {
                from: 'exams',
                localField: 'exam',
                foreignField: '_id',
                as: 'exam',
            },
        },
        {
            $unwind: '$exam',
        },
        {
            $match: {
                'exam.subject': new mongoose.Types.ObjectId(subjectId),
            },
        },
        {
            $sort: {
                finalScore: -1,
            },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
            },
        },
        {
            $unwind: '$student',
        },
    ]);
    return result;
};
export const getBestStudentPerSubjectPerClass = async (subjectId, stdClass) => {
    return await Result.aggregate([
        // Join Exam
        {
            $lookup: {
                from: 'exams',
                localField: 'exam',
                foreignField: '_id',
                as: 'exam',
            },
        },
        {
            $unwind: '$exam',
        },
        // Filter by subject and class
        {
            $match: {
                'exam.subject': new mongoose.Types.ObjectId(subjectId),
                'exam.class': stdClass,
            },
        },
        // Highest score first
        {
            $sort: {
                finalScore: -1,
            },
        },
        // Keep only the highest
        {
            $limit: 1,
        },
        // Join Student
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
            },
        },
        {
            $unwind: '$student',
        },
        // Join Subject (optional)
        {
            $lookup: {
                from: 'subjects',
                localField: 'exam.subject',
                foreignField: '_id',
                as: 'subject',
            },
        },
        {
            $unwind: '$subject',
        },
        // Shape the response
        {
            $project: {
                _id: 0,
                studentId: '$student._id',
                studentName: '$student.name',
                class: '$exam.class',
                subject: '$subject.name',
                score: '$finalScore',
                grade: 1,
                cbtScore: 1,
                writtenScore: 1,
            },
        },
    ]);
};
//# sourceMappingURL=result.service.js.map