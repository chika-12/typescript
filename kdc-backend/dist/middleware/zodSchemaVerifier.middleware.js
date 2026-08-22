import AppError from "../utils/appError.js";
const resultMapper = (input) => {
    const value = input.map((val) => {
        return val.message;
    });
    return value.join(', ');
};
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = resultMapper(result.error.issues);
            return next(new AppError(`${message}`, 400));
        }
        req.body = result.data;
        next();
    };
};
//# sourceMappingURL=zodSchemaVerifier.middleware.js.map