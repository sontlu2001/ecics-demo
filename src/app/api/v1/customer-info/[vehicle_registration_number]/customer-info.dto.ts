import { z } from "zod";

export const getCustomerInfoDTO = z.object({
  vehicle_registration_number : z.string().min(1, "Vehicle registration number is required"),
});

export type getCustomerInfoDTO = z.infer<typeof getCustomerInfoDTO>;
