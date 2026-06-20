import mongoose from 'mongoose';

const timeTableSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'closed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

timeTableSchema.index({ assignedTeacher: 1, startTime: 1 }, { unique: true });
const TimeTable = mongoose.model('TimeTable', timeTableSchema);
export default TimeTable;
