import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.ts';
import { Staff } from '../models/registration.ts';
import { Student } from '../models/studentModel.ts';
import { Parent } from '../models/parentsModels.ts';
import { catchAsync } from '../utils/catchAsync.ts';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new AppError(
          'You are not logged in. Please log in to get access.',
          401,
        ),
      );
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 3. Check user still exists based on role
    let currentUser: any;

    if (decoded.role === 'student') {
      currentUser = await Student.findById(decoded.id);
    } else if (decoded.role === 'parent') {
      currentUser = await Parent.findById(decoded.id);
    } else {
      currentUser = await Staff.findById(decoded.id);
    }

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401),
      );
    }

    // 4. Attach user and role to request
    req.user = currentUser;
    req.user.role = decoded.role;

    next();
  },
);

// 5. RestrictTo middleware
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
