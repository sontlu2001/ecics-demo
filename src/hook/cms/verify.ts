import verify from '@/api/cms-service/verify';
import { useMutation } from '@tanstack/react-query';

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
