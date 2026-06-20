import mongoose from 'mongoose';

const termSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
      trim: true,
    },

    term: {
      type: String,
      required: true,
      enum: ['first', 'second', 'third'],
    },

    //offeredSubjects: [String], change average calc to classSubject.subjects

    isFinalised: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const Term = mongoose.model('Term', termSchema);
