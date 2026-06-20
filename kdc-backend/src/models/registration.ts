//@ts-nocheck
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IStaff } from '../interfaces/staff.interface.ts';

const staffSchema = new mongoose.Schema<IStaff>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },

    role: {
      type: String,
      enum: ['teacher', 'admin', 'superAdmin'],
      required: [true, 'Role is required'],
    },

    phone: {
      type: String,
      trim: true,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Auto-generate employeeId for teachers
staffSchema.pre('save', async function () {
  if (this.role !== 'teacher') return;
  if (this.employeeId) return;

  const year = new Date().getFullYear();

  const lastStaff = await Staff.findOne(
    { employeeId: { $regex: `^KDC/TCH/${year}/` } },
    { employeeId: 1 },
    { sort: { createdAt: -1 } },
  );
  let sequential = 1;
  if (lastStaff?.employeeId) {
    const lastNumber = parseInt(lastStaff.employeeId.split('/').pop(), 10);
    sequential = lastNumber + 1;
  }
  this.employeeId = `KDC/TCH/${year}/${String(sequential).padStart(3, '0')}`;
});

// Hash password
staffSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password on login
staffSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Never return inactive staff
staffSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
});

export const Staff = mongoose.model('Staff', staffSchema);
