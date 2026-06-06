// @ts-nocheck
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../interfaces/user.interface.ts';

const usersSchema = new mongoose.Schema<IUser>(
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

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
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

    role: {
      type: String,

      enum: ['user', 'student', 'teacher', 'admin', 'superAdmin'],

      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    address: String,
  },
  { timestamps: true }
);

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

usersSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.Password);
};

usersSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

export const Users = mongoose.model('Users', usersSchema);
