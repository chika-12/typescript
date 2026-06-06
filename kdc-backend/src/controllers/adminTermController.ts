import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';
import { createTerm } from '../services/termService.ts';

export const createTermController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createTerm(req.body);
    if (!data) {
      return next(new AppError('Term not created', 403));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);
