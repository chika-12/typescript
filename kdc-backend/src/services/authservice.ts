import { Staff } from '../models/registration.ts';
import { Student } from '../models/studentModel.ts';
import { Parent } from '../models/parentsModels.ts';
import AppError from '../utils/appError.ts';
import jwt, { SignOptions } from 'jsonwebtoken';

const signToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

export const loginService = async (identifier: string, password: string) => {
  if (!identifier || !password) {
    throw new AppError('Please provide email/ID and password', 400);
  }

  // Determine if identifier is a studentId or email
  const isStudentId = /^[A-Z]{3}\/\d{4}\/\d{3}$/.test(identifier);

  if (isStudentId) {
    // Check Students collection
    const student = (await Student.findOne({ studentId: identifier }).select(
      '+password',
    )) as any;
    if (!student || !(await student.comparePassword(password))) {
      throw new AppError('Invalid credentials from password', 401);
    }

    if (!student.isActive) {
      throw new AppError(
        'Your account has been deactivated. Contact admin.',
        401,
      );
    }

    const token = signToken({
      id: student._id,
      role: 'student',
      name: student.name,
      class: student.class,
    });

    return {
      token,
      mustChangePassword: student.mustChangePassword,
      user: {
        id: student._id,
        name: student.name,
        role: 'student',
        class: student.class,
      },
    };
  }

  // Check Staff collection first
  let user: any = await Staff.findOne({ email: identifier }).select(
    '+password',
  );
  let role = user?.role;

  // If not found in Staff, check Parents
  if (!user) {
    user = await Parent.findOne({ email: identifier }).select('+password');
    role = 'parent';
  }

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError(
      'Your account has been deactivated. Contact admin.',
      401,
    );
  }

  const tokenPayload: any = {
    id: user._id,
    role,
    name: `${user.firstName} ${user.lastName}`,
  };

  // Include students array in token for parents
  if (role === 'parent') {
    tokenPayload.students = user.students;
  }

  const token = signToken(tokenPayload);

  return {
    token,
    mustChangePassword: user.mustChangePassword,
    user: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role,
      ...(role === 'parent' && { students: user.students }),
    },
  };
};
