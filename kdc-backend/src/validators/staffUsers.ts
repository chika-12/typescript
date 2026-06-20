import { z } from 'zod';

export const staffUserSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  email: z.email(),
  role: z.enum(['teacher', 'admin', 'superAdmin']),
  address: z.string().min(3),
});
export type StaffUserInput = z.infer<typeof staffUserSchema>;
