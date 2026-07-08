import mongoose from 'mongoose';

const studentResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    cbtScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
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
      enum: ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'F9'],
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true },
);

// Unique constraint: one result per student per exam
studentResultSchema.index({ student: 1, exam: 1 }, { unique: true });

export const Result = mongoose.model('Result', studentResultSchema);
