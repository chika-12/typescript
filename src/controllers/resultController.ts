import type { Request, Response, NextFunction } from 'express';
import topScorer from '../utils/topscorer.ts';
import calStudentScore from '../utils/calculateAverage.ts';

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
