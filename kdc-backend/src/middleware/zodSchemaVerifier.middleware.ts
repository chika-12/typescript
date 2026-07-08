import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

const resultMapper = (input: any[]) => {
  const value = input.map((val) => {
    return val.message;
  });
  return value.join(', ');
};
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = resultMapper(result.error.issues);
      return next(new AppError(`${message}`, 400));
    }
    req.body = result.data;
    next();
  };
};
