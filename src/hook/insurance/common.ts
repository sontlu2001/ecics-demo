import { useMutation, useQuery } from '@tanstack/react-query';

import { VehicleCheckResponse } from '@/libs/types/auth';

import verify from '@/api/base-service/verify';
import { formatPromoCode } from '@/libs/utils/utils';

interface CheckVehiclePayload {
  vehicle_make: string;
  vehicle_model: string;
}

export const useVerifyPartnerCode = (partner_code: string) => {
  const fetchQuote = async () => {
    const res = await verify.verifyPartnerCode(partner_code);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', partner_code],
    enabled: !!partner_code,
  });
};

export const useVerifyPromoCode = () => {
  const fetchQuote = async (promo_code: string) => {
    const formattedPromoCode = formatPromoCode(promo_code);
    const res = await verify.verifyPromoCode({
      promo_code: formattedPromoCode,
      product_type: 'car',
    });
    return res.data;
  };

  return useMutation({
    mutationFn: fetchQuote,
    mutationKey: ['promo'],
  });
};

export const useGetVehicleMakes = () => {
  const fetchVehicleMakes = async () => {
    const res = await verify.getVehicleMakes();
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchVehicleMakes,
    queryKey: ['vehicle-makes'],
  });
};

export const useGetVehicleModels = (id: string) => {
  const fetchVehicleModels = async () => {
    const res = await verify.getVehicleModels(id);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchVehicleModels,
    queryKey: ['vehicle-models', id],
    enabled: !!id,
  });
};

export const usePostCheckVehicle = (onUnmatch: () => void) => {
  const fetchCheckVehicle = async (
    payload: CheckVehiclePayload,
  ): Promise<VehicleCheckResponse> => {
    const res = await verify.postCheckVehicle(payload);
    return res.data.data;
  };

  return useMutation<VehicleCheckResponse, Error, CheckVehiclePayload>({
    mutationFn: fetchCheckVehicle,
    mutationKey: ['check-vehicle'],
    onError: (error) => {
      const errorMessage = (error as any)?.response?.data?.message;
      if (errorMessage === 'Vehicle make or model not found') {
        onUnmatch(); // Trigger modal
      }
      console.error(error);
    },
  });
};
