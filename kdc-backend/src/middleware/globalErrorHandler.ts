import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(400).json({
      status: 'error',
      message: `Duplicate value for: ${field}. This record already exists.`,
    });
  } else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
    return res.status(400).json({
      status: 'error',
      message: messages,
    });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(400).json({
      status: 'Error',
      message: 'Please login',
    });
  } else if (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError'
  ) {
    return res.status(503).json({
      status: 'error',
      message: 'Connection failed. Please try again shortly.',
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
