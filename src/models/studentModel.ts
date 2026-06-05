//@ts-nocheck
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      enum: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
    },
    role: {
      type: String,
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    dob: {
      type: Date,
      required: true,
    },
    parentsContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      relationship: {
        type: String,
        enum: ['father', 'mother', 'guardian'],
        required: true,
      },
    },
    studentFile: {
      type: String, // Cloudinary URL
    },
  },
  { timestamps: true }
);

// Auto-generate studentId before saving
studentSchema.pre('save', async function (next) {
  if (this.studentId) return;

  const year = new Date().getFullYear();
  const prefix = this.name.substring(0, 3).toUpperCase();

  const count = await Student.countDocuments({
    studentId: { $regex: `^${prefix}/${year}/` },
  });

  const sequential = String(count + 1).padStart(3, '0');
  this.studentId = `${prefix}/${year}/${sequential}`;
});

export const Student = mongoose.model('Student', studentSchema);
