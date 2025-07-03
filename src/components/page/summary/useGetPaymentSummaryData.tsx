import { getPaymentType } from '@/libs/utils/utils';

import { useGetPaymentSummaryData } from '@/hook/cms/verify';

export const usePaymentSummaryFromQuote = (
  productTypeName?: string,
  isElectricModel?: boolean,
) => {
  const paymentType = getPaymentType(productTypeName, isElectricModel);
  return useGetPaymentSummaryData(paymentType ?? '');
};
