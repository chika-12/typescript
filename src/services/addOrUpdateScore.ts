import { Result } from '../models/resultModel.ts';
import type { CreateScoreInput } from '../interfaces/scoreInput.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import AppError from '../utils/appError.ts';

export const addOrUpdateResult = async (data: CreateScoreInput) => {
  const { name, studentId, term, subject, score, teacherId } = data;
  const student = await Result.findOne({ studentId, term });
  if (!student) {
    const result = await Result.create({
      studentId,
      term,
      name,
      scores: [{ subject, score, teacherId }],
    });
    return result;
  }
  const existinScoreIndex = student.scores.findIndex((s) => {
    return s.subject === subject;
  });
  if (existinScoreIndex != -1) {
    student.scores[existinScoreIndex].score = score;
    student.scores[existinScoreIndex].teacherId = teacherId;
  } else {
    student.scores.push({ subject, score, teacherId });
  }
  await student.save();
  return student;
};
