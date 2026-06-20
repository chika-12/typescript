import ClassSubject from '../models/classSubjects.ts';
import AppError from '../utils/appError.ts';
import type { IClassSubject } from '../interfaces/classSubject.interface.ts';
import Subject from '../models/subjects.ts';

export const createClassSubject = async function (data: IClassSubject) {
  const classSubject = await ClassSubject.create({
    class: data.class,
    subjects: data.subjects,
    term: data.term,
  });
  return classSubject;
};

export const addSubjectToClass = async function (id: string, subjects: string) {
  const classSubjects = await ClassSubject.findById(id);
  const searchSubject = await Subject.findOne({ name: subjects });
  if (!searchSubject) {
    throw new AppError(`${subjects} does not exist in subject collection`, 404);
  }
  if (!classSubjects) {
    throw new AppError('This class does not exist', 404);
  }
  const alreadyExist = classSubjects.subjects.some(
    (s) => s.toString() === searchSubject._id.toString(),
  );
  if (alreadyExist) {
    throw new AppError('Subject already exists in class', 409);
  }
  classSubjects.subjects.push(searchSubject._id);
  await classSubjects.save();
  return classSubjects;
};

export const removeSubject = async function (id: string, subjectId: string) {
  const cls = await ClassSubject.findById(id);
  if (!cls) {
    throw new AppError('This class does not exist', 404);
  }
  const alreadyExist = cls.subjects.some((s) => s.toString() === subjectId);
  if (!alreadyExist) {
    throw new AppError('Subject not found', 404);
  }
  cls.subjects = cls.subjects.filter((s) => s.toString() !== subjectId);
  await cls.save();
  return cls;
};

export const getAllSubjects = async function (query: {
  class?: string;
  term?: string;
}) {
  const allClasses = await ClassSubject.find(query)
    .populate('subjects')
    .populate('term');
  return allClasses;
};

export const deleteClassSubject = async function (id: string) {
  const deleteClassSubject = await ClassSubject.findByIdAndDelete(id);
  if (!deleteClassSubject) {
    throw new AppError('class not found', 404);
  }
  return deleteClassSubject;
};
