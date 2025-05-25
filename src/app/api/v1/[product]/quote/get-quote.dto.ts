import { REGEX_VALUES } from '@/app/api/utils/regex';
import { z } from 'zod';

export const generateQuoteSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  partner_code: z.string().optional(),
  promo_code: z.string().optional(),
  company_id: z.number().optional(),
  company_name_other: z.string().optional(),
  personal_info: z.object({
    name: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    marital_status: z
      .enum(['Single', 'Married', 'Divorced', 'Widowed'])
      .optional(),
    nric: z.string().optional(),
    address: z.string().optional(),
    date_of_birth: z
      .string()
      .regex(
        REGEX_VALUES.DATE_OF_BIRTH,
        'Date of birth must be in the format dd-mm-yyyy',
      ),
    driving_experience: z.number(),
    phone: z.string().regex(REGEX_VALUES.PHONE_NUMBER, 'Phone number invalid'),
    email: z.string().regex(REGEX_VALUES.PHONE_NUMBER, 'Phone number invalid'),
    post_code: z.string().optional(),
  }),
  vehicle_info_selected: z.any().optional(),
  insurance_additional_info: z.object({
    no_claim_discount: z.number(),
    no_of_claim: z.number(),
    start_date: z
      .string()
      .regex(
        REGEX_VALUES.DATE_OF_BIRTH,
        'Date of birth must be in the format dd-mm-yyyy',
      ),
    end_date: z
      .string()
      .regex(
        REGEX_VALUES.DATE_OF_BIRTH,
        'Date of birth must be in the format dd-mm-yyyy',
      ),
    vehicle_finance_by: z.number(),
  }),
});

export type generateQuoteDTO = z.infer<typeof generateQuoteSchema>;
