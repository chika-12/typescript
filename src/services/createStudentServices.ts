import { Student } from '../models/studentModel.ts';
import AppError from '../utils/appError.ts';
import { parseDMYDate } from '../utils/dateParser.ts';
import type { CreateStudentInput } from '../interfaces/createStudent.interface.ts';
import type { UpdateStudentInput } from '../interfaces/studentUpdate.interface.ts';
import { parseStudentQuery } from '../utils/studentNLPParser.ts';

export const createStudent = async (data: CreateStudentInput) => {
  const { name, stdClass, gender, dob, parentsContact } = data;
  // const existingStudent = await Student.findOne({ name });
  // if (existingStudent) {
  //   throw new AppError('Student already exist', 403);
  // }
  const newDob = parseDMYDate(dob);
  const student = await Student.create({
    name,
    class: stdClass,
    gender,
    dob: newDob,
    parentsContact,
  });
  return student;
};

export const updateStudent = async function (
  id: string,
  data: UpdateStudentInput
) {
  const allowedFields = [
    'name',
    'class',
    'gender',
    'dob',
    'parentsContact',
    'studentFile',
  ];
  const filteredBody = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );
  const updatedData = await Student.findByIdAndUpdate(
    id,
    { $set: filteredBody },
    { new: true, runValidators: true }
  );
  return updatedData;
};

export const serachAllStudent = async () => {
  const data = await Student.find();
  return data;
};
export const searchStudentByStudentId = async (data: string) => {
  const student = await Student.findOne({ studentId: data });
  return student;
};

export const searchStudentById = async (data: string) => {
  const student = await Student.findOne({ _id: data });
  return student;
};

//Natural Language

export const searchStudents = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  const { filter, sort, count } = parseStudentQuery(query);
  const skip = (page - 1) * limit;

  if (count) {
    const total = await Student.countDocuments(filter);
    return { count: total, filter };
  }

  const students = await Student.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    students,
  };
};
