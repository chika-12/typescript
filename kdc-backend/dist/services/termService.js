import { Term } from "../models/termModel.js";
import AppError from "../utils/appError.js";
import { parseDMYDate } from "../utils/dateParser.js";
export const createTerm = async (data) => {
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
//# sourceMappingURL=termService.js.map