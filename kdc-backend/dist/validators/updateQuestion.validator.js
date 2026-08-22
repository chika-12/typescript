import { z } from 'zod';
export const updateQuestionSchema = z.object({
    questionText: z.string().min(4).optional(),
    options: z
        .array(z.object({
        label: z.enum(['A', 'B', 'C', 'D']),
        text: z.string().min(2),
    }))
        .length(4)
        .optional(),
    correctAnswer: z.enum(['A', 'B', 'C', 'D']).optional(),
});
//# sourceMappingURL=updateQuestion.validator.js.map