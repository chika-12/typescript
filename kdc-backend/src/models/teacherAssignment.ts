import mongoose from 'mongoose';

const teacherAssignmentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: String,
      enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
      required: true,
    },
    arm: {
      type: String,
      required: false,
    },
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Term',
      required: true,
    },
  },
  { timestamps: true },
);
teacherAssignmentSchema.index(
  { term: 1, subject: 1, class: 1 },
  { unique: true },
);
const TeacherAssign = mongoose.model('TeacherAssign', teacherAssignmentSchema);

export default TeacherAssign;
