import { REGEX_VALUES } from '@/app/api/utils/regex';
import { z } from 'zod';

export const savePersonalInfoDTOSchema = z.object({
  phone: z.string().optional(),
  email: z.string().min(1, 'Email is required'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  gender: z.string().optional(),
  nric: z.string().min(1, 'NRIC is required'),
  marital_status: z.string().optional(),
  date_of_birth: z.string(),
  address: z.array(z.string()).optional(),
  vehicle_make: z.string().optional(),
  vehicle_model: z.string().optional(),
  year_of_registration: z.string().optional(),
  vehicles: z.array(z.any()).optional(),
  key: z.string().min(1, 'Key is required'),
});

export type savePersonalInfoDTO = z.infer<typeof savePersonalInfoDTOSchema>;
