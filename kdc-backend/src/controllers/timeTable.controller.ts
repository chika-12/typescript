import { success } from 'zod';
import {
  createTimeTable,
  updateTimeTable,
  getTimetables,
  deleteExamTimeTable,
} from '../services/timeTable.service.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';

export const createTimeTableCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createTimeTable(req.body);
    if (!data) {
      return next(new AppError('Time table creation failed', 400));
    }
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);
export const updateTimeTableCtrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateTimeTable(req.params.id as string, req.body);
    if (!data) {
      return next(new AppError('Update failed', 403));
    }
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);

export const getTimetablesCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getTimetables(req.query);
    if (!data || data.length === 0) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const deleteExamTimeTableCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await deleteExamTimeTable(req.params.id as string);
    return res.status(200).json({
      status: 'success',
      data,
    });
  },
);
