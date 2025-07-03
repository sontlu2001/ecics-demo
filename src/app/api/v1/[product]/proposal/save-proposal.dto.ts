import { z } from 'zod';

export const saveQuoteProposalSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  selected_plan: z.string().min(1, 'Plan must be selected'),
  selected_addons: z.any(),
  add_named_driver_info: z.array(z.any()),
});

export type saveQuoteProposalDTO = z.infer<typeof saveQuoteProposalSchema>;

export const saveQuoteProposalForMaidSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  selected_plan: z.string().min(1, 'Plan must be selected'),
  selected_addons: z.any(),
  personal_info: z.any(),
  maid_info: z.any(),
});

export type saveQuoteProposalForMaidDTO = z.infer<
  typeof saveQuoteProposalForMaidSchema
>;
