import mongoose from 'mongoose';
import { z } from 'zod';
export const examSchema = z.object({
    assignedTeacher: z
        .string()
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid mongodb string',
    }),
    subject: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid mongodb string',
    }),
    className: z.enum(['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']),
    term: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid mongodb string',
    }),
    duration: z.number().int().positive(),
    isReleased: z.boolean().default(false),
});
//# sourceMappingURL=examValidator.js.map