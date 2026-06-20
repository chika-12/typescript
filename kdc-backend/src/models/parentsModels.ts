//@ts-nocheck
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const parentSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['father', 'mother', 'guardian'],
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      default: 'parent',
      immutable: true, // can never be changed after creation
    },
  },
  { timestamps: true },
);

// Hash password before saving
parentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

parentSchema.methods.comparePassword = async function (
  enteredPassword: string,
) {
  return bcrypt.compare(enteredPassword, this.password);
};

parentSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

export const Parent = mongoose.model('Parent', parentSchema);
