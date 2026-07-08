import ExamSession from '../models/examSession.ts';
import AppError from '../utils/appError.ts';
import { Exam } from '../models/examModels.ts';
import { getQuestions } from './questions.service.ts';
import TimeTable from '../models/timeTable.ts';
import { Question } from '../models/questions.ts';
import TeacherAssign from '../models/teacherAssignment.ts';

export const startExam = async (
  examId: string,
  studentId: string,
  userRole: string,
) => {
  const timeTable = await TimeTable.findOne({ exam: examId });
  if (!timeTable) {
    throw new AppError('Exam not scheduled yet', 403);
  }
  const question = await getQuestions(userRole, examId, studentId);
  const examCheck = await ExamSession.findOne({
    exam: examId,
    student: studentId,
    timeTable: timeTable._id,
  });
  if (examCheck) {
    if (
      examCheck.status === 'submitted' ||
      examCheck.status === 'auto-submitted'
    ) {
      throw new AppError('You have taken this exams', 409);
    }
    return { examSession: examCheck, question };
  }

  const examSession = await ExamSession.create({
    exam: examId,
    student: studentId,
    status: 'active',
    startTime: new Date(),
    timeTable: timeTable._id,
  });
  return { examSession, question };
};

export const submitExam = async (
  examSessionId: string,
  answers: any[],
  userId: string,
) => {
  const examSessionCheck = await ExamSession.findOne({ _id: examSessionId });
  if (
    !examSessionCheck ||
    examSessionCheck.student.toString() !== userId ||
    examSessionCheck.status !== 'active'
  ) {
    throw new AppError('No active exam session', 404);
  }
  let numberOfCorrectAnswer = 0;
  const questionIds = answers.map((q) => q.question);
  const questions = await Question.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
  const processedAnswers = answers.map((answer) => {
    const question = questionMap.get(answer.question);
    if (!question) throw new AppError('Question not found', 404);
    const isCorrect = question.correctAnswer === answer.selectedAnswer;
    if (isCorrect) numberOfCorrectAnswer++;
    return {
      question: answer.question,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
    };
  });
  const cbtScore = numberOfCorrectAnswer;
  const percentage = (numberOfCorrectAnswer / questions.length) * 100;
  const submit = await ExamSession.findOneAndUpdate(
    {
      _id: examSessionId,
    },
    {
      answers: processedAnswers,
      cbtScore: cbtScore,
      percentage: percentage,
      endTime: new Date(),
      status: 'submitted',
      noFailed: questions.length - numberOfCorrectAnswer,
    },
    { new: true },
  );
  return submit;
};
export const getExamSession = async (
  examId: string,
  userId: string,
  userRole: string,
) => {
  let query: any = {};
  if (userRole === 'student') {
    query.student = userId;
    query.exam = examId;
  }
  if (userRole === 'teacher') {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new AppError('Exam not found', 404);
    }
    const teacher = await TeacherAssign.findById(exam.assignedTeacher);
    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }
    if (teacher.teacher.toString() !== userId) {
      throw new AppError('You can not view this exam', 403);
    }
    query.exam = examId;
  }
  if (userRole === 'admin') {
    query.exam = examId;
  }
  const data = await ExamSession.find(query)
    .populate('student')
    .populate('timeTable')
    .populate('exam')
    .populate('answers.question');
  return data;
};

export const getExamSessionById = async (
  sessionId: string,
  userId: string,
  userRole: string,
) => {
  const data = await ExamSession.findById(sessionId)
    .populate('student')
    .populate('timeTable')
    .populate('exam')
    .populate('answers.question');
  if (!data) {
    throw new AppError('Data not found', 404);
  }
  if (userRole === 'student') {
    if (data.student._id.toString() !== userId) {
      throw new AppError('You dont have permission to view this exam', 403);
    }
  } else if (userRole === 'teacher') {
    const exam = data.exam;
    if (!exam) {
      throw new AppError('Exam not found for this session', 404);
    }
    const assignedTeacherId = (data.exam as any).assignedTeacher;
    const teacher = await TeacherAssign.findById(assignedTeacherId);
    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }
    if (teacher.teacher.toString() !== userId) {
      throw new AppError('You can not view this exam', 403);
    }
  }
  return data;
};
