import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

import singpassCarService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLogin() {
    return singpassCarService.get<LoginResponse>(`${API_LOGIN}`);
  },
  postUserInfo({ params, payload }: { params: any; payload: UserInfoPayload }) {
    return singpassCarService.post<any>(`${API_GET_USER_INFO}`, payload, {
      params,
    });
  },
};
