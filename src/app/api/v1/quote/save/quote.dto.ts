import { z } from "zod";

export const saveQuoteDTOSchema= z.object({
  quoteId: z.string().nullable().optional(),
  quoteNo: z.string().nullable().optional(),
  policyId: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  data: z.any().nullable().optional(),
  partnerCode: z.string().nullable().optional(),
  isFinalized: z.boolean().nullable().optional(),
  isPaid: z.boolean().nullable().optional(),
  expirationDate: z.date().nullable().optional(),
  key: z.string().min(1, "Code is required"),
  ipAddress: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  personalInfoId: z.number().nullable().optional(),
  companyId: z.number().nullable().optional(),
  paymentResultId: z.number().nullable().optional(),
  countryNationalityId: z.number().nullable().optional(),
  productTypeId: z.number().nullable().optional(),
  promoCodeId: z.number().nullable().optional(),
});

export type saveQuoteDTO = z.infer<typeof saveQuoteDTOSchema>;
