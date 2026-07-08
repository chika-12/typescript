import {
  startExam,
  submitExam,
  getExamSession,
  getExamSessionById,
} from '../services/examSession.service.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

export const startExamCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await startExam(
      req.params.examId as string,
      req.user.id,
      req.user.role,
    );
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);
export const submitExamCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await submitExam(
      req.params.examSessionId as string,
      req.body.answers,
      req.user.id,
    );
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const getExamSessionCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getExamSession(
      req.params.examId as string,
      req.user.id,
      req.user.role,
    );
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
export const getExamSessionByIdCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getExamSessionById(
      req.params.sessionId as string,
      req.user.id,
      req.user.role,
    );
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
