import mongoose from 'mongoose';

const studentResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    term: String,
    scores: [
      {
        subject: String,
        score: Number,
        teacherId: String,
      },
    ],
  },
  { timestamps: true }
);
studentResultSchema.index({ studentId: 1, term: 1 }, { unique: true });
export const Result = mongoose.model('Result', studentResultSchema);
