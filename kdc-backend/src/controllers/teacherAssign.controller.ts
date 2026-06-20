import {
  createTeacherAssignment,
  updateTeacherAssignment,
  getTeacherAssignments,
  deleteTeacherAssignment,
} from '../services/assignTeacher.servive.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';

export const createTeacherAssignCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createTeacherAssignment(req.body);
    if (!data) {
      return next(new AppError('Assignment Failed', 403));
    }
    return res.status(201).json({
      status: 'Success',
      message: 'Teacher Assignment Successfull',
    });
  },
);

export const updateTeacherAssignmentCtrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateTeacherAssignment(
      req.params.id as string,
      req.body,
    );
    if (!data) {
      return next(new AppError('Data update failed', 403));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const getTeacherAssignmentsCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const enteredData = {
      userId: req.user.id,
      userRole: req.user.role,
    };

    const data = await getTeacherAssignments(enteredData, req.query);
    if (!data || data.length == 0) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const deleteTeacherAssignmentCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await deleteTeacherAssignment(req.params.id as string);

    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      message: 'Data deleted successfully',
    });
  },
);
