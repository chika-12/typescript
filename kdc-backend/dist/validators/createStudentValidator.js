import { z } from 'zod';
export const createStudent = z.object({
    name: z.string().min(3).max(100),
    stdClass: z.enum(['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']),
    gender: z.enum(['male', 'female']),
    dob: z.string().regex(/\d{2}\/\d{2}\/\d{4}/),
    parentsContact: z.object({
        name: z.string().min(3),
        phone: z.string().min(11),
        email: z.email().optional(),
        relationship: z.enum(['father', 'mother', 'guardian'])
    }),
});
//# sourceMappingURL=createStudentValidator.js.map