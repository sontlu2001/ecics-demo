import { z } from 'zod';

export const paymentResultDTOSchema = z.object({
  policy_id: z.string().min(1, 'Policy ID is required'),
  policy_no: z.string().min(1, 'Policy number is required'),
});

export type paymentDTO = z.infer<typeof paymentResultDTOSchema>;
