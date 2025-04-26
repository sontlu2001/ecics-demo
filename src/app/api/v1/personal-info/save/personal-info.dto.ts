import { REGEX_VALUES } from '@/app/api/utils/regex';
import { z } from 'zod';

export const savePersonalInfoDTOSchema = z.object({
  phone: z.string().regex(REGEX_VALUES.PHONE_NUMBER, 'Invalid phone number'),
  email: z.string().regex(REGEX_VALUES.EMAIL, 'Invalid email address'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  gender: z.enum(['Male', 'Female', 'Other']),
  nric: z.string().min(1, 'NRIC is required'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  dateOfBirth: z.string(),
  address: z.string().min(1, 'Address is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  yearOfRegistration: z.string().min(1, 'Year of registration is required'),
  vehicles: z.array(z.any()).optional(),
  key: z.string().min(1, 'Key is required'),
});

export type savePersonalInfoDTO = z.infer<typeof savePersonalInfoDTOSchema>;
