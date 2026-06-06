import { Term } from '../models/termModel.ts';
import AppError from '../utils/appError.ts';

export const examFinaliseChecker = async (term: string, session: string) => {
  const examCheck = await Term.findOne({ term: term, session: session });
  if (!examCheck) {
    throw new AppError('No term or session found', 404);
  }
  if (examCheck?.isFinalised) {
    throw new AppError('This term has been finalized', 403);
  }
  return examCheck;
};
export default examFinaliseChecker;
