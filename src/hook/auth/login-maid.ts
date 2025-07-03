import { useMutation, useQuery } from '@tanstack/react-query';

import { SavePersonalInfoPayload, UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import insurance from '@/api/base-service/insurance';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import auth from '@/api/singpass-maid-service/auth';

export const useRequestLoginMaid = () => {
  const requestLoginMaid = async () => {
    const res = await auth.requestLoginMaid();
    return res.data;
  };

  return useMutation({
    mutationFn: requestLoginMaid,
    mutationKey: ['login'],
    onSuccess: (data) => {
      window.location.href = data.url;
      saveToSessionStorage({
        state: data.state,
        nonce: data.nonce,
        code_verifier: data.code_verifier,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const usePostUserInfoMaid = ({
  params,
  payload,
}: {
  params: any;
  payload: UserInfoPayload;
}) => {
  const postUserInfoMaid = async () => {
    const res = await auth.postUserInfoMaid({ params, payload });
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(res.data) });
    saveToSessionStorage({ [DATA_FROM_SINGPASS]: JSON.stringify(res.data) });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfoMaid,
    queryKey: ['user-info-maid', params],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!params?.code,
  });
};

export const usePostPersonalInfoMaid = () => {
  const postPersonalInfoMaid = async (payload: any) => {
    const res = await insurance.postPersonalInfoSave(payload);
    return res.data;
  };
  return useMutation({
    mutationFn: postPersonalInfoMaid,
    mutationKey: ['personal-info-maid'],
    onSuccess: (_data, variables) => {
      if (variables.shouldRedirect === false) return;

      const queryParams = new URLSearchParams({
        key: variables.key,
      });

      const partnerCode = localStorage.getItem(PARTNER_CODE);
      const promoCode = localStorage.getItem(PROMO_CODE);

      if (partnerCode) {
        queryParams.append('partner_code', partnerCode);
      }

      if (promoCode) {
        queryParams.append('promo_code', promoCode);
      }

      window.location.href = `${ROUTES.INSURANCE_MAID.BASIC_DETAIL_SINGPASS}&${queryParams.toString()}`;
    },
  });
};
