import type { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/authservice.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, password } = req.body;
    const result = await loginService(identifier, password);
    if (!result) {
      return next(new AppError('Login failed', 403));
    }
    res.status(200).json({
      status: 'success',
      token: result.token,
      mustChangePassword: result.mustChangePassword,
      data: result.user,
    });
  },
);
