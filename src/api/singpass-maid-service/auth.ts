import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

import singpassMaidService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLoginMaid() {
    return singpassMaidService.get<LoginResponse>(`${API_LOGIN}`);
  },
  postUserInfoMaid({
    params,
    payload,
  }: {
    params: any;
    payload: UserInfoPayload;
  }) {
    return singpassMaidService.post<any>(`${API_GET_USER_INFO}`, payload, {
      params,
    });
  },
};
