import { z } from 'zod';

export const updateExamSchema = z.object({
  duration: z.number().int().positive(),
  className: z.enum(['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']),
});
