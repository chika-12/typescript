import { z } from 'zod';
import mongoose from 'mongoose';
export const submitExamSessionSchema = z.object({
    answers: z.array(z.object({
        question: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid question ID',
        }),
        selectedAnswer: z.enum(['A', 'B', 'C', 'D']),
    })),
});
//# sourceMappingURL=startExamSession.validator.js.map