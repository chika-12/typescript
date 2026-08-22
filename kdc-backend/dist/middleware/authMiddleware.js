import jwt from 'jsonwebtoken';
import AppError from "../utils/appError.js";
import { Staff } from "../models/registration.js";
import { Student } from "../models/studentModel.js";
import { Parent } from "../models/parentsModels.js";
import { catchAsync } from "../utils/catchAsync.js";
export const protect = catchAsync(async (req, res, next) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    const token = authHeader.split(' ')[1];
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Check user still exists based on role
    let currentUser;
    if (decoded.role === 'student') {
        currentUser = await Student.findById(decoded.id);
    }
    else if (decoded.role === 'parent') {
        currentUser = await Parent.findById(decoded.id);
    }
    else {
        currentUser = await Staff.findById(decoded.id);
    }
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    // 4. Attach user and role to request
    req.user = currentUser;
    req.user.role = decoded.role;
    next();
});
// 5. RestrictTo middleware
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
//# sourceMappingURL=authMiddleware.js.map