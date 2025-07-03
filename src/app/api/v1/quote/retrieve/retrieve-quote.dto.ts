import { REGEX_VALUES } from '@/app/api/utils/regex';
import { z } from 'zod';

export const retrieveQuoteDTOSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  phone: z.string().regex(REGEX_VALUES.PHONE_NUMBER, 'Phone number is invalid'),
});

export type retrieveQuoteDTO = z.infer<typeof retrieveQuoteDTOSchema>;
