import { useMutation, useQuery } from '@tanstack/react-query';

import verify from '@/api/cms-service/verify';

export const useVerifyRestrictedUser = () => {
  const fetchRestrictedUser = async ({
    vehicle_registration_number,
    national_identity_no,
  }: {
    vehicle_registration_number?: string;
    national_identity_no?: string;
  }) => {
    const res = await verify.verifyRestrictedUser({
      vehicle_registration_number,
      national_identity_no,
    });
    return res.data;
  };

  return useMutation({
    mutationFn: fetchRestrictedUser,
    mutationKey: ['verify-restricted-user'],
  });
};

export const useGetPaymentSummaryData = (product_type: string) => {
  const fetchPaymentSummary = async () => {
    const res = await verify.getPaymentSummaryData(product_type);
    return res.data;
  };

  return useQuery({
    queryFn: fetchPaymentSummary,
    queryKey: ['payment-summary', product_type],
    enabled: !!product_type,
  });
};
