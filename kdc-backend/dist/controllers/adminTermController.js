import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { createTerm } from "../services/termService.js";
export const createTermController = catchAsync(async (req, res, next) => {
    const data = await createTerm(req.body);
    if (!data) {
        return next(new AppError('Term not created', 403));
    }
    return res.status(200).json({
        status: 'Success',
        data,
    });
});
//# sourceMappingURL=adminTermController.js.map