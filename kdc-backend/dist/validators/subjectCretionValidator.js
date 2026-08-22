import { z } from 'zod';
export const createSubjectSchema = z.object({
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(3),
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=subjectCretionValidator.js.map