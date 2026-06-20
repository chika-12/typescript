import {
  createSubject,
  updateSubject,
  getSubjects,
} from '../services/subjectService.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';

export const createSubjectController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    if (!data.name || !data.code) {
      return next(new AppError('Add subject name and subject code', 400));
    }
    const subject = await createSubject(data);
    return res.status(201).json({
      status: 'Success',
      message: `${subject.name} has been added to subject collection`,
    });
  },
);
export const updateSubjectController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const id = req.params.id as string;
    const subUpdate = await updateSubject(id, data);
    return res.status(200).json({
      status: 'Success',
      message: `${subUpdate.name} has been successfully updated`,
    });
  },
);

export const allSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getSubjects(req.user.role);
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
