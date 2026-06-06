import { Result } from '../models/resultModel.ts';
import type { CreateScoreInput } from '../interfaces/scoreInput.ts';
import AppError from '../utils/appError.ts';
import examFinaliseChecker from '../utils/isFinalizedCheker.ts';
import { Term } from '../models/termModel.ts';

export const createResult = async (payload: CreateScoreInput) => {
  const examChecker = await examFinaliseChecker(payload.term, payload.session);

  const existingResult = await Result.findOne({
    studentId: payload.studentId,
    term: examChecker.term,
    session: examChecker.session,
  });

  if (existingResult) {
    throw new AppError('Result already exists', 409);
  }

  return await Result.create({
    studentId: payload.studentId,
    term: examChecker.term,
    name: payload.name,
    session: examChecker.session,
    scores: [
      {
        subject: payload.subject,
        score: payload.score,
        teacherId: payload.teacherId,
      },
    ],
  });
};

export const updateSubjectScore = async (payload: CreateScoreInput) => {
  const { studentId, term, subject, score, teacherId, session } = payload;
  const examCheck = await examFinaliseChecker(term, session);
  return await Result.findOneAndUpdate(
    {
      studentId,
      term: examCheck.term,
      'scores.subject': subject,
      session: examCheck.session,
    },
    {
      $set: {
        'scores.$.score': score,
        'scores.$.teacherId': teacherId,
      },
    },
    { new: true }
  );
};

export const addSubjectScore = async (payload: CreateScoreInput) => {
  const { studentId, term, subject, score, teacherId, session } = payload;
  const examChecker = await examFinaliseChecker(term, session);

  const existing = await Result.findOne({
    studentId,
    term: examChecker.term,
    session: examChecker.session,
    'scores.subject': subject,
  });

  if (existing) {
    throw new AppError(`Score for ${subject} already exists`, 400);
  }

  return await Result.findOneAndUpdate(
    { studentId, term: examChecker.term, session: examChecker.session },
    { $push: { scores: { subject, score, teacherId } } },
    { new: true }
  );
};

export const getAllStudentResult = async () => {
  return await Result.aggregate([
    {
      $addFields: {
        totalScore: { $sum: '$scores.score' },
        averageScore: { $avg: '$scores.score' },
      },
    },
  ]);
};

export const getStudentsResultById = async (data: string) => {
  const stdRecord = await Result.findOne({ _id: data });
  return stdRecord;
};

export const getStudentsResultByRegNo = async (studentId: string) => {
  const result = await Result.aggregate([
    { $match: { studentId } },
    {
      $addFields: {
        totalScore: { $sum: '$scores.score' },
        averageScore: { $avg: '$scores.score' },
      },
    },
  ]);
  return result[0] || null;
};

export const getStudentsResultByTerm = async (
  data: string,
  session: string
) => {
  return await Result.aggregate([
    { $match: { term: data, session } },
    {
      $addFields: {
        totalScore: { $sum: '$scores.score' },
        averageScore: { $avg: '$scores.score' },
      },
    },
  ]);
};

export const getBestStudentPerTermAndSession = async (
  term: string,
  session: string
) => {
  const data = await Result.aggregate([
    { $match: { term, session } },
    {
      $addFields: {
        totalScore: { $sum: '$scores.score' },
        averageScore: { $avg: '$scores.score' },
      },
    },
    { $sort: { averageScore: -1 } },
    {
      $group: {
        _id: { term: '$term', session: '$session' },
        bestStudent: { $first: '$name' },
        studentId: { $first: '$studentId' },
        averageScore: { $first: '$averageScore' },
        totalScore: { $first: '$totalScore' },
      },
    },
  ]);
  return data;
};

export const getBestStudentsForSession = async (session: string) => {
  // Step 1: get all terms for this session and count total offered subjects
  const terms = await Term.find({ session });

  if (!terms.length) {
    throw new AppError('No terms found for this session', 404);
  }

  const totalOfferedSubjects = terms.reduce((acc, term) => {
    return acc + (term.offeredSubjects?.length || 0);
  }, 0);

  if (totalOfferedSubjects === 0) {
    throw new AppError('No offered subjects found for this session', 400);
  }

  // Step 2: aggregate results using totalOfferedSubjects as divisor
  return await Result.aggregate([
    { $match: { session } },
    { $unwind: '$scores' },
    {
      $group: {
        _id: '$studentId',
        name: { $first: '$name' },
        totalScore: { $sum: '$scores.score' },
      },
    },
    {
      $addFields: {
        sessionAverage: { $divide: ['$totalScore', totalOfferedSubjects] },
      },
    },
    { $sort: { sessionAverage: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        name: 1,
        studentId: '$_id',
        totalScore: 1,
        sessionAverage: 1,
        totalOfferedSubjects: { $literal: totalOfferedSubjects },
      },
    },
  ]);
};
