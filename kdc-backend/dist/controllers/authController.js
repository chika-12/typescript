import { loginService } from "../services/authservice.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const login = catchAsync(async (req, res, next) => {
    const { identifier, password } = req.body;
    const result = await loginService(identifier, password);
    if (!result) {
        return next(new AppError('Login failed', 403));
    }
    res.status(200).json({
        status: 'success',
        token: result.token,
        mustChangePassword: result.mustChangePassword,
        data: result.user,
    });
});
//# sourceMappingURL=authController.js.map