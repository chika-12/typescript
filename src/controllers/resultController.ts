import type { Request, Response, NextFunction } from 'express';
//import topScorer from '../utils/topscorer.ts';
//import calStudentScore from '../utils/calculateAverage.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import {
  createResult,
  getAllStudentResult,
  updateSubjectScore,
  addSubjectScore,
  getStudentsResultById,
  getStudentsResultByRegNo,
  getStudentsResultByTerm,
  getBestStudentsForSession,
  getBestStudentPerTermAndSession,
} from '../services/addOrUpdateScore.ts';
import AppError from '../utils/appError.ts';

export const getResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getAllStudentResult();

    console;
    if (data.length === 0) {
      return next(new AppError('No data found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const addStudentsResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createResult(req.body);
    if (!data) {
      return next(new AppError('something went wrong', 500));
    }
    return res.status(200).json({
      message: 'success',
      data,
    });
  }
);
export const updateSubjectScoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateSubjectScore(req.body);
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);
export const addSubjectScoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await addSubjectScore(req.body);
    if (!data) {
      return next(new AppError('Error Occured', 403));
    }

    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const getStudentsResultByRegNoController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.params.studentId as string;
    const data = await getStudentsResultByRegNo(studentId);
    console.log(data);
    if (!data) {
      return next(new AppError('Student not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const getStudentsResultByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const data = await getStudentsResultById(id);
    if (!data) {
      return next(new AppError('Student not found', 404));
    }

    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const getStudentsResultByTermController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { term, session } = req.body;
    const data = await getStudentsResultByTerm(term, session);
    if (data.length === 0) {
      return next(new AppError('Result not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  }
);

export const bestStudentOverallSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { session } = req.body;
    const best = await getBestStudentsForSession(session);

    if (!best) {
      return next(new AppError('Term not finalized yet', 403));
    }
    return res.status(200).json({
      status: 'Success',
      best,
    });
  }
);

export const getBestStudentPerTermController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { term, session } = req.body;
    const bestPerTerm = await getBestStudentPerTermAndSession(term, session);
    if (!bestPerTerm) {
      return next(new AppError('Term not finalized', 403));
    }
    return res.status(200).json({
      status: 'Success',
      bestPerTerm,
    });
  }
);
