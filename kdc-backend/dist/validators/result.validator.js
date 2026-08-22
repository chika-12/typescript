import { z } from 'zod';
export const createResultSchema = z.object({
    studentRegNo: z.string().min(3), // Validate registration number format
    writtenScore: z.number().min(0).max(100), // 0-100
    term: z.enum(['first', 'second', 'third']),
    session: z.string().regex(/^\d{4}\/\d{4}$/, {
        message: 'Session must be in the format YYYY/YYYY (e.g. 2020/2026)',
    }),
});
//# sourceMappingURL=result.validator.js.map