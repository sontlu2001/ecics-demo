import { z } from 'zod';

export const saveQuoteDTOSchema = z.object({
  quote_id: z.string().nullable().optional(),
  quote_no: z.string().nullable().optional(),
  policy_id: z.string().nullable().optional(),
  product_id: z.string().nullable().optional(),
  proposal_id: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  data: z.any().nullable().optional(),
  partner_code: z.string().nullable().optional(),
  is_finalized: z.boolean().nullable().optional(),
  is_paid: z.boolean().nullable().optional(),
  expiration_date: z.date().nullable().optional(),
  key: z.string().min(1, 'Code is required'),
  personal_info_id: z.number().nullable().optional(),
  company_id: z.number().nullable().optional(),
  payment_result_id: z.number().nullable().optional(),
  country_nationality_id: z.number().nullable().optional(),
  product_type_id: z.number().nullable().optional(),
  promo_code_id: z.number().nullable().optional(),
  is_sending_email: z.boolean().nullable().optional(),
});

export type saveQuoteDTO = z.infer<typeof saveQuoteDTOSchema>;
