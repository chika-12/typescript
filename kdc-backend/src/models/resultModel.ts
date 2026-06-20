import mongoose from 'mongoose';

const studentResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeacherAssign',
    },
    cbtScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    writtenScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
  },
  { timestamps: true },
);
studentResultSchema.index(
  { student: 1, term: 1, subject: 1 },
  { unique: true },
);
export const Result = mongoose.model('Result', studentResultSchema);
