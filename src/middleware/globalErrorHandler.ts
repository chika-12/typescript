import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Unexpected errors
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

export default errorHandler;
