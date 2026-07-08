import { Exam } from '../models/examModels.ts';
import AppError from '../utils/appError.ts';
import { ExamInput } from '../validators/examValidator.ts';
import TeacherAssign from '../models/teacherAssignment.ts';
import Subject from '../models/subjects.ts';
import { Term } from '../models/termModel.ts';
import { Student } from '../models/studentModel.ts';
import ExamSession from '../models/examSession.ts';
import TimeTable from '../models/timeTable.ts';

export const createExam = async (userId: string, data: ExamInput) => {
  const { assignedTeacher, className, subject, duration, term } = data;

  const subCheck = await Subject.findOne({ _id: subject });
  const assignedTeacherCheck = await TeacherAssign.findOne({
    _id: assignedTeacher,
  });
  const teacherId = assignedTeacherCheck?.teacher?.toString() || '';

  if (teacherId !== userId) {
    throw new AppError('You are not permitted to create this exams', 403);
  }
  const termCheck = await Term.findOne({ _id: term });
  if (!termCheck) {
    throw new AppError('Term does not exist', 404);
  }
  if (termCheck.isFinalised) {
    throw new AppError('This term has been closed', 403);
  }

  if (!subCheck) {
    throw new AppError('No such subject in subject collection', 404);
  }
  if (!assignedTeacherCheck) {
    throw new AppError('Teacher does not exist', 404);
  }
  const exam = await Exam.create({
    assignedTeacher,
    class: className,
    subject,
    duration,
    term,
  });
  return await Exam.findById(exam._id)
    .populate('assignedTeacher')
    .populate('subject')
    .populate('term');
};

export const getExams = async (
  userId: string,
  userRole: string,
  filter: any,
) => {
  let query: any = {};

  if (userRole === 'student') {
    const student = await Student.findOne({ _id: userId });
    if (!student) {
      throw new AppError('Student does not exist', 404);
    }
    query = { class: student.class };
  } else if (userRole === 'teacher') {
    const teacherAssignments = await TeacherAssign.find({ teacher: userId });
    const assignmentIds = teacherAssignments.map((ta) => ta._id);
    query = { assignedTeacher: { $in: assignmentIds } };
  } else if (userRole === 'admin' || userRole === 'superAdmin') {
    if (filter?.term) query.term = filter.term;
    if (filter?.class) query.class = filter.class;
  }

  const examData = await Exam.find(query)
    .populate('assignedTeacher')
    .populate('subject')
    .populate('term');

  return examData;
};

export const getExamsById = async (
  id: string,
  userId: string,
  userRole: string,
) => {
  const data = await Exam.findOne({ _id: id })
    .populate('assignedTeacher')
    .populate('subject')
    .populate('term');

  if (!data) {
    throw new AppError('Exam not found', 404);
  }

  if (userRole === 'student') {
    const student = await Student.findOne({ _id: userId });
    if (!student || student.class !== data.class) {
      throw new AppError('Exam not found', 404); // Don't leak existence
    }
  } else if (userRole === 'teacher') {
    const teacherAssignments = await TeacherAssign.find({ teacher: userId });
    const assignmentIds = teacherAssignments.map((ta) => ta._id.toString());

    const assignedTeacherId = data.assignedTeacher?._id?.toString();
    if (!assignmentIds.includes(assignedTeacherId)) {
      throw new AppError('Exam not found', 404); // Don't leak existence
    }
  }
  return data;
};

export const updateExam = async (
  id: string,
  userId: string,
  data: Partial<ExamInput>,
) => {
  const returnVal = await Exam.findOne({ _id: id });
  if (!returnVal) {
    throw new AppError('No exam record', 404);
  }
  const assignedTeacher = await TeacherAssign.findOne({
    _id: returnVal.assignedTeacher,
  });
  if (!assignedTeacher) {
    throw new AppError('TeacherAssignment not found', 500);
  }
  if (assignedTeacher.teacher.toString() !== userId) {
    throw new AppError('You dont have permission to make this change', 403);
  }
  const timeTableRestrictionCheck = await TimeTable.findOne({ exam: id });
  if (timeTableRestrictionCheck) {
    throw new AppError('Cannot update exam with scheduled timetable', 403);
  }
  if (data.duration !== undefined) returnVal.duration = data.duration;
  if (data.className !== undefined) returnVal.class = data.className;
  const saved = await returnVal.save();
  await saved.populate('subject');
  await saved.populate('term');
  await saved.populate('assignedTeacher');
  return saved;
};

export const deleteExam = async (id: string, userId: string) => {
  const data = await Exam.findOne({ _id: id });
  if (!data) {
    throw new AppError('Exam does not exist', 404);
  }
  const assignedTeacher = await TeacherAssign.findById(data.assignedTeacher);
  if (!assignedTeacher) {
    throw new AppError('TeacherAssignment not found', 500);
  }
  if (assignedTeacher.teacher.toString() !== userId) {
    throw new AppError('You dont have permission to delete this exam', 403);
  }
  const timetableExists = await TimeTable.findOne({ exam: id });
  if (timetableExists) {
    throw new AppError('Cannot delete exam with scheduled timetable', 409);
  }
  const term = await Term.findOne({ _id: data.term });
  if (!term) {
    throw new AppError('Term reference broken', 500);
  }

  if (data.isReleased) {
    throw new AppError('A released exam can not be deleted', 403);
  }
  if (term?.isFinalised) {
    throw new AppError('This exam has been finalised', 403);
  }
  const deleteData = await Exam.findByIdAndDelete(id);
  return deleteData;
};
