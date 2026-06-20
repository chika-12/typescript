import TeacherAssign from '../models/teacherAssignment.ts';
import AppError from '../utils/appError.ts';
import { CreateTeacherAssign } from '../interfaces/createTeacherAssign.interface.ts';
import { Student } from '../models/studentModel.ts';
import mongoose from 'mongoose';

export const createTeacherAssignment = async (data: CreateTeacherAssign) => {
  const { teacher, className, term, subject, arm } = data;
  const assigned = await TeacherAssign.create({
    teacher,
    class: className,
    term,
    subject,
    arm,
  });
  return assigned;
};
export const getTeacherAssignments = async (
  data: { userRole: string; userId: string },
  query: { term?: string; subject?: string; class?: string },
) => {
  let assinged;

  if (data.userRole == 'teacher') {
    assinged = await TeacherAssign.find({
      teacher: data.userId,
      term: query.term?.toLowerCase(),
    })
      .populate('teacher', 'firstName lastName')
      .populate('subject', 'name code');
  }
  if (data.userRole === 'student') {
    const student = await Student.findById(data.userId);
    if (!student || !student.isActive) {
      throw new AppError('Student not found', 404);
    }
    assinged = await TeacherAssign.find({
      class: student.class,
      term: query.term?.toLocaleLowerCase(),
    })
      .populate('teacher', 'firstName lastName')
      .populate('subject', 'name code');
  }
  if (data.userRole === 'admin' || data.userRole === 'superAdmin') {
    assinged = await TeacherAssign.find(query)
      .populate('teacher', 'firstName lastName')
      .populate('subject', 'name code');
  }

  if (!assinged) {
    throw new AppError('Data not found', 404);
  }
  return assinged;
};

export const updateTeacherAssignment = async (
  assignmentId: string,
  data: Partial<CreateTeacherAssign>,
) => {
  const assigned = await TeacherAssign.findById(assignmentId);
  if (!assigned) {
    throw new AppError('Assignment not found', 404);
  }
  if (data.className !== undefined) assigned.class = data.className;
  if (data.subject !== undefined)
    assigned.subject = new mongoose.Types.ObjectId(data.subject);
  if (data.teacher !== undefined)
    assigned.teacher = new mongoose.Types.ObjectId(data.teacher);
  if (data.term !== undefined)
    assigned.term = new mongoose.Types.ObjectId(data.term);
  if (data.arm !== undefined) assigned.arm = data.arm;
  await assigned.save();
  return assigned;
};

export const deleteTeacherAssignment = async (assignedId: string) => {
  const deleteAssing = await TeacherAssign.findByIdAndDelete(assignedId);
  if (!deleteAssing) {
    throw new AppError('Document does not exist', 404);
  }
  return deleteAssing;
};
