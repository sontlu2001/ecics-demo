import { useMutation, useQuery } from '@tanstack/react-query';

import { SavePersonalInfoPayload, UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import insurance from '@/api/base-service/insurance';
import auth from '@/api/singpass-service/auth';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';

export const useRequestLogin = () => {
  const requestLogin = async () => {
    const res = await auth.requestLogin();
    return res.data;
  };

  return useMutation({
    mutationFn: requestLogin,
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

export const usePostUserInfo = ({
  params,
  payload,
}: {
  params: any;
  payload: UserInfoPayload;
}) => {
  const postUserInfo = async () => {
    const res = await auth.postUserInfo({ params, payload });
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(res.data) });
    saveToSessionStorage({ [DATA_FROM_SINGPASS]: JSON.stringify(res.data) });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfo,
    queryKey: ['user-info', params],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!params?.code,
  });
};

export const usePostPersonalInfo = () => {
  const postPersonalInfo = async (payload: SavePersonalInfoPayload) => {
    const res = await insurance.postPersonalInfoSave(payload);
    return res.data;
  };
  return useMutation({
    mutationFn: postPersonalInfo,
    mutationKey: ['personal-info'],
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

      window.location.href = `${ROUTES.INSURANCE.BASIC_DETAIL_SINGPASS}&${queryParams.toString()}`;
    },
  });
};
