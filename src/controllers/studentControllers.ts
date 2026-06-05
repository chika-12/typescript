import {
  createStudent,
  serachAllStudent,
  searchStudents,
  searchStudentById,
  searchStudentByStudentId,
  updateStudent,
} from '../services/createStudentServices.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';

export const createStudentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createStudent(req.body);
    if (!data) {
      return next(new AppError('Student not created', 403));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const searchStudentByStudentIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = searchStudentByStudentId(req.body.studentId);
    if (!data) {
      return next(new AppError('Student not fount', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const searchStudentByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = searchStudentById(req.params.id as string);
    if (!data) {
      return next(new AppError('Student not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const updateStudentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateStudent(req.params.id as string, req.body);
    if (!data) {
      return next(new AppError('Update failed', 403));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const serachAllStudentController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await serachAllStudent();
    if (data.length === 0) {
      return next(new AppError('No student found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

//Natural Language Controller
export const searchStudentsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.q as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!query) {
      return next(new AppError('Search query is required', 400));
    }

    const data = await searchStudents(query, page, limit);
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);
