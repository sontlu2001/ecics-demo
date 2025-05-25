import { z } from "zod";

export const getInfoPromoCodeSchema = z.object({
  promo_code: z.string().min(1, "Code is required"),
  product_type: z.string().min(1, "Product type is required"),
});

export type geInfoPromocodeDTO = z.infer<typeof getInfoPromoCodeSchema>;
