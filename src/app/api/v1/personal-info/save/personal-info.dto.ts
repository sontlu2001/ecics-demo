import { REGEX_VALUES } from '@/app/api/utils/regex';
import { z } from 'zod';

export const savePersonalInfoDTOSchema = z.object({
  personal_info: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    gender: z.string().optional(),
    marital_status: z.string().optional(),
    date_of_birth: z.string(),
    nric: z.string().min(1, 'NRIC is required'),
    address: z.array(z.string()).optional(),
    phone: z.string().optional(),
    email: z.string().min(1, 'Email is required'),
    driving_experience: z.string().optional(),
    post_code: z.string().optional(),
  }),
  vehicle_info_selected: z.any().optional(),
  vehicles: z.array(z.any()).optional(),
  key: z.string().min(1, 'Key is required'),
  is_sending_email: z.boolean().optional(),
  promo_code: z.string().nullable().optional(),
  partner_code: z.string().nullable().optional(),
  data_from_singpass: z.any().optional(),
  product_type: z.string(),
});

export type savePersonalInfoDTO = z.infer<typeof savePersonalInfoDTOSchema>;
