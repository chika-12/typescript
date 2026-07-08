import mongoose from 'mongoose';
import { z } from 'zod';

export const questionsSchema = z.object({
  exam: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid mongodb string',
  }),
  questionText: z.string().min(4),
  options: z
    .array(
      z.object({
        label: z.enum(['A', 'B', 'C', 'D']),
        text: z.string().min(2),
      }),
    )
    .length(4),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
});
export type QuestionInput = z.infer<typeof questionsSchema>;
