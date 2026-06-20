import mongoose from 'mongoose';
import { z } from 'zod';

export const timeTableSchema = z.object({
  exam: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid mongoDB ObjectId',
  }),
  startTime: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
    .transform((val) => {
      const date = val.split(' ')[0];
      const time = val.split(' ')[1];

      const dateFraction = date.split('/');
      const day = dateFraction[0];
      const month = dateFraction[1];
      const year = dateFraction[2];

      const hour = time.split(':')[0];
      const minute = time.split(':')[1];
      const fulldate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
      );
      return fulldate;
    })
    .refine(
      (val) => {
        return Date.now() < val.getTime();
      },
      {
        message: 'startTime must be in the future',
      },
    ),
});
export type CreateTimeTable = z.infer<typeof timeTableSchema>;
