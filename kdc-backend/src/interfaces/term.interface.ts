import { Types } from 'mongoose';

export interface ITerm {
  session: string;
  term: 'first' | 'second' | 'third';
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
