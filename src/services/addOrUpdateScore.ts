import { Result } from '../models/resultModel.ts';
import type { CreateScoreInput } from '../interfaces/scoreInput.ts';
import AppError from '../utils/appError.ts';
import examFinaliseChecker from '../utils/isFinalizedCheker.ts';

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
  return await Result.findOneAndUpdate(
    { studentId, term: examChecker.term, session: examChecker.session },
    {
      $push: {
        scores: { subject, score, teacherId },
      },
    },
    { new: true }
  );
};

export const getAllStudentResult = async () => {
  return await Result.find();
};

export const getStudentsResultById = async (data: string) => {
  const stdRecord = await Result.findOne({ _id: data });
  return stdRecord;
};

export const getStudentsResultByRegNo = async (data: string) => {
  const stdRecord = await Result.findOne({ studentId: data });
  return stdRecord;
};

export const getStudentsResultByTerm = async (data: string) => {
  const stdRecord = await Result.find({ term: data });
  return stdRecord;
};
