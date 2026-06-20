import { z } from 'zod';

export const termCreationSchema = z.object({
  session: z.string(),
  term: z.enum(['first', 'second', 'third']),
  startDate: z.string().regex(/\d{2}\/\d{2}\/\d{4}/),
  endDate: z.string().regex(/\d{2}\/\d{2}\/\d{4}/),
});

export type TermCreationInput = z.infer<typeof termCreationSchema>;
