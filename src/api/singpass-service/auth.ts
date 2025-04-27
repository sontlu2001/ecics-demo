import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import singpassService from './api.config';
import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLogin() {
    return singpassService.get<LoginResponse>(`${API_LOGIN}`);
  },
  postUserInfo({ params, payload }: { params: any; payload: UserInfoPayload }) {
    return singpassService.post<any>(`${API_GET_USER_INFO}`, payload, {
      params,
    });
  },
};
