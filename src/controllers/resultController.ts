import type { Request, Response, NextFunction } from 'express';
import topScorer from '../utils/topscorer.ts';
import calStudentScore from '../utils/calculateAverage.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import {
  createResult,
  getAllStudentResult,
  updateSubjectScore,
  addSubjectScore,
  getStudentsResultById,
  getStudentsResultByRegNo,
  getStudentsResultByTerm,
} from '../services/addOrUpdateScore.ts';
import AppError from '../utils/appError.ts';

export const getResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getAllStudentResult();

    console;
    if (data.length === 0) {
      return next(new AppError('No data found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const addStudentsResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createResult(req.body);
    if (!data) {
      return next(new AppError('something went wrong', 500));
    }
    return res.status(200).json({
      message: 'success',
      data,
    });
  }
);
