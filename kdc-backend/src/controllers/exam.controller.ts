import {
  createExam,
  getExams,
  updateExam,
  deleteExam,
  getExamsById,
} from '../services/exam.service.ts';
import type { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync.ts';
import AppError from '../utils/appError.ts';

export const createExamCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createExam(req.user.id, req.body);
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);

export const getExamsCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getExams(req.user.id, req.user.role, req.query);
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
export const updateExamCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateExam(
      req.params.id as string,
      req.user.id,
      req.body,
    );
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
export const getExamsByIdCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getExamsById(
      req.params.id as string,
      req.user.id,
      req.user.role,
    );
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
export const deleteExamCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await deleteExam(req.params.id as string, req.user.id);
    return res.status(200).json({
      status: 'Success',
      message: 'Data deleted',
      data,
    });
  },
);
