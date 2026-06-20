import mongoose, { Schema, Types } from 'mongoose';

const ExamSchema = new Schema(
  {
    assignedTeacher: {
      type: Types.ObjectId,
      ref: 'TeacherAssign',
      required: true,
    },
    subject: { type: Types.ObjectId, ref: 'Subject', required: true },
    class: {
      type: String,
      enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
      required: true,
    },
    term: { type: Types.ObjectId, ref: 'Term', required: true },
    duration: { type: Number, required: true },
    isReleased: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ExamSchema.index(
  { assignedTeacher: 1, subject: 1, class: 1, term: 1 },
  { unique: true },
);

export const Exam = mongoose.model('Exam', ExamSchema);
