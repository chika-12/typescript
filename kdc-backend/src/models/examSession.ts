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
    answers: [
      {
        questions: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswers: {
          type: String,
          enum: ['A', 'B', 'C', 'D'],
        },
      },
    ],
    cbtScore: Number,
    status: {
      type: String,
      enum: ['pending', 'active', 'submitted', 'auto-submitted'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
examSessionSchema.index({ timeTable: 1, student: 1 }, { unique: true });

const ExamSession = mongoose.model('ExamSession', examSessionSchema);
export default ExamSession;
