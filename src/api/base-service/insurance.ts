import { SavePersonalInfoPayload } from '@/libs/types/auth';
import { QuoteCreationPayload, QuoteResponse } from '@/libs/types/quote';

import { API_POST_PERSONAL_INFO_SAVE } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getQuoteByKey(key: string) {
    return baseClient.get<QuoteResponse>('/quote/' + key);
  },
  createQuote(data: QuoteCreationPayload) {
    return baseClient.post<QuoteResponse>('/car/quote', data);
  },
  postPersonalInfoSave(payload: SavePersonalInfoPayload) {
    return baseClient.post<any>(`${API_POST_PERSONAL_INFO_SAVE}`, payload);
  },
  requestLogCar() {
    return baseClient.get<any>('/request-log/car');
  },
};
