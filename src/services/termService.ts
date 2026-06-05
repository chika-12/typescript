import { Term } from '../models/termModel.ts';
import type { ITerm } from '../interfaces/term.interface.ts';
import AppError from '../utils/appError.ts';
import { parseDMYDate } from '../utils/dateParser.ts';

export const createTerm = async (data: ITerm) => {
  const { term, session, startDate, endDate } = data;
  const lowerTerm = term.toLowerCase();
  const newStartDate = parseDMYDate(startDate);
  const newEndDate = parseDMYDate(endDate);
  const existTerm = await Term.findOne({ session, term });
  if (existTerm) {
    throw new AppError('This term already exist', 403);
  }

  const termData = await Term.create({
    term: lowerTerm,
    session,
    endDate: newEndDate,
    startDate: newStartDate,
  });
  return termData;
};
