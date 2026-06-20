import {
  signUpStaffs,
  signUpAdmin,
  updateStaffService,
  deactivateStaffService,
  reactivateStaffService,
  upgradeToAdminService,
  removeAdminService,
  getAllStaffService,
  getOneStaffService,
} from '../services/staffService.ts';
import AppError from '../utils/appError.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import type { Request, Response, NextFunction } from 'express';

export const signUpStaffsControler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await signUpStaffs(req.body);
    if (!data)
      return next(new AppError('Sorry your teacher account failed', 403));
    return res.status(201).json({
      status: 'success',
      message: 'Teacher account created. Credentials sent to email.',
    });
  },
);

export const signUpAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await signUpAdmin(req.body);
    if (!data)
      return next(new AppError('Sorry your admin account failed', 403));
    return res.status(201).json({
      status: 'success',
      message: 'Admin account created. Credentials sent to email.',
    });
  },
);

export const updateStaffController = catchAsync(
  async (req: Request, res: Response) => {
    const updated = await updateStaffService(
      req.params.id as string,
      req.body,
      req.user.role,
    );
    return res.status(200).json({
      status: 'success',
      message: 'Staff updated successfully',
      data: {
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        role: updated.role,
        employeeId: updated.employeeId,
      },
    });
  },
);

export const deactivateStaffController = catchAsync(
  async (req: Request, res: Response) => {
    await deactivateStaffService(req.params.id as string, req.user.role);
    return res.status(200).json({
      status: 'success',
      message: 'Staff account deactivated successfully',
    });
  },
);

export const reactivateStaffController = catchAsync(
  async (req: Request, res: Response) => {
    await reactivateStaffService(req.params.id as string, req.user.role);
    return res.status(200).json({
      status: 'success',
      message: 'Staff account reactivated successfully',
    });
  },
);

export const upgradeToAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const updated = await upgradeToAdminService(
      req.params.id as string,
      req.user.role,
    );
    return res.status(200).json({
      status: 'success',
      message: `${updated.firstName} has been upgraded to admin`,
      data: {
        name: `${updated.firstName} ${updated.lastName}`,
        role: updated.role,
        employeeId: updated.employeeId,
      },
    });
  },
);

export const removeAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const updated = await removeAdminService(
      req.params.id as string,
      req.user.role,
    );
    return res.status(200).json({
      status: 'success',
      message: `${updated.firstName} has been removed as admin`,
      data: {
        name: `${updated.firstName} ${updated.lastName}`,
        role: updated.role,
        employeeId: updated.employeeId,
      },
    });
  },
);

export const getAllStaffController = catchAsync(
  async (req: Request, res: Response) => {
    const staff = await getAllStaffService(req.user.role);
    return res.status(200).json({
      status: 'success',
      results: staff.length,
      data: staff,
    });
  },
);

export const getOneStaffController = catchAsync(
  async (req: Request, res: Response) => {
    const staff = await getOneStaffService(
      req.params.id as string,
      req.user.role,
    );
    return res.status(200).json({
      status: 'success',
      data: staff,
    });
  },
);
