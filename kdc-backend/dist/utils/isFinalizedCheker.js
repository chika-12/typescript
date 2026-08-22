import { Term } from "../models/termModel.js";
import AppError from "../utils/appError.js";
export const examFinaliseChecker = async (term, session) => {
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
//# sourceMappingURL=isFinalizedCheker.js.map