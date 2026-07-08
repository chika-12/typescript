import mongoose from 'mongoose';
const examSessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    timeTable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeTable',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswer: {
          type: String,
          enum: ['A', 'B', 'C', 'D'],
        },
        isCorrect: Boolean,
      },
    ],
    cbtScore: Number,
    status: {
      type: String,
      enum: ['pending', 'active', 'submitted', 'auto-submitted'],
      default: 'pending',
    },
    noFailed: Number,
    percentage: Number,
    startTime: Date,
    endTime: Date,
  },
  { timestamps: true },
);
examSessionSchema.index({ timeTable: 1, student: 1 }, { unique: true });

const ExamSession = mongoose.model('ExamSession', examSessionSchema);
export default ExamSession;
