import type { Request, Response, NextFunction } from 'express';
//import topScorer from '../utils/topscorer.ts';
//import calStudentScore from '../utils/calculateAverage.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import {
  createResultWithWrittenScore,
  getAllResults,
  getResultsById,
  getResultsByStudentId,
  getBestStudentInSubject,
  getBestStudentPerSubjectPerClass,
} from '../services/result.service.ts';
import AppError from '../utils/appError.ts';

export const createResultWithWrittenScoreCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await createResultWithWrittenScore(
      req.params.examId as string,
      req.body.studentRegNo,
      req.body.writtenScore,
      req.user.id,
      req.body.term,
      req.body.session,
    );
    return res.status(201).json({
      status: 'Success',
      data,
    });
  },
);

export const getAllResultsCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getAllResults(
      req.user.id,
      req.user.role,
      req.query.term as string,
      req.query.session as string,
      req.query.classId as string,
    );
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const getResultsByIdCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getResultsById(
      req.params.resultId as string,
      req.user.id,
      req.user.role,
    );
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const getResultsByStudentIdCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getResultsByStudentId(
      req.query.studentId as string,
      req.user.id,
      req.user.role,
    );
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
export const getBestStudentInSubjectCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getBestStudentInSubject(req.params.subjectId as string);
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);

export const getBestStudentInSubjectByClassCtr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getBestStudentPerSubjectPerClass(
      req.params.subjectId as string,
      req.params.classId as string,
    );
    if (!data) {
      return next(new AppError('Data not found', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data,
    });
  },
);
