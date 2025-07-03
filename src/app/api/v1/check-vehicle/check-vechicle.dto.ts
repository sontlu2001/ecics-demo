import { z } from 'zod';

export const checkVehicleDTOSchema = z.object({
  vehicle_make: z.string().min(1, 'Vehicle make is required'),
  vehicle_model: z.string().min(1, 'Vehicle model is required'),
});

export type checkVehicleDTO = z.infer<typeof checkVehicleDTOSchema>;
