import type { Request, Response, NextFunction } from 'express';
import topScorer from '../utils/topscorer.ts';
import calStudentScore from '../utils/calculateAverage.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import { addOrUpdateResult } from '../services/addOrUpdateScore.ts';
import AppError from '../utils/appError.ts';

const students: Record<string, number[]> = {
  chika: [23, 45, 35, 89],
  mary: [45, 12, 55, 23],
  peter: [34, 11, 4, 1],
};

export const getResult = (req: Request, res: Response, next: NextFunction) => {
  const data1 = calStudentScore(students);
  const data2 = topScorer(data1);
  res.status(200).json({
    message: 'success',
    data: {
      averages: data1,
      best_student: data2,
    },
  });
};

export const addStudentsResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await addOrUpdateResult(req.body);
    if (!data) {
      return next(new AppError('something went wrong', 500));
    }
    return res.status(200).json({
      message: 'success',
      data,
    });
  }
);

