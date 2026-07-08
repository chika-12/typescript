import {
  createQuestion,
  updateQuestion,
  getQuestions,
  deleteExamQuestion,
} from '../services/questions.service.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

export const createQuestionCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createQuestion(req.body, req.user.id);
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);
export const updateQuestionCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateQuestion(
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

export const getQuestionsCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getQuestions(
      req.user.role,
      req.params.examId as string,
      req.user.id,
    );
    return res.status(200).json({
      status: 'Success',
      NumberOfQuestions: data?.length ?? 0,
      data,
    });
  },
);

export const deleteQuestionCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteExamQuestion(req.params.id as string, req.user.id);
    return res.status(200).json({
      status: 'Success',
      message: 'Question deleted successfully',
    });
  },
);
