import {
  MaidQuoteCreationPayload,
  MaidQuoteResponse,
} from '@/libs/types/maidQuote';

import { API_GET_QUOTE_BY_KEY, API_SAVE_QUOTE } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getMaidQuoteByKey(key: string) {
    return baseClient.get<MaidQuoteResponse>(`${API_GET_QUOTE_BY_KEY}` + key);
  },
  generateMaidQuote(data: MaidQuoteCreationPayload) {
    return baseClient.post<MaidQuoteResponse>('/maid/quote', data);
  },
  saveMaidQuote(key: string, data: any, is_sending_email: boolean) {
    const formatData = {
      data: { ...data },
      key: key,
      is_sending_email: is_sending_email,
    };
    return baseClient.post<MaidQuoteResponse>(`${API_SAVE_QUOTE}`, formatData);
  },
};
