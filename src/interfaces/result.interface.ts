import { Score } from './score.interface.ts';

export interface StudentResult {
  studentId: string;
  name: string;
  term: string;
  scores: Score[];
  createdAt?: Date;
  updatedAt?: Date;
}
