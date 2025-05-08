import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  ProposalPayload,
  QuoteCreationPayload,
  QuoteData,
  QuoteResponse,
} from '@/libs/types/quote';

import { API_POST_PERSONAL_INFO_SAVE } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getQuoteByKey(key: string) {
    return baseClient.get<QuoteResponse>('/quote/' + key);
  },
  generateQuote(data: QuoteCreationPayload) {
    return baseClient.post<QuoteResponse>('/car/quote', data);
  },
  saveProposal(data: ProposalPayload) {
    return baseClient.post<any>('/car/proposal', data);
  },
  saveQuote(key: string, data: QuoteData) {
    const formatData = {
      data: { ...data },
      key: key,
    };
    return baseClient.post<QuoteResponse>('/quote/save', formatData);
  },
  postPersonalInfoSave(payload: SavePersonalInfoPayload) {
    return baseClient.post<any>(`${API_POST_PERSONAL_INFO_SAVE}`, payload);
  },
  requestLogCar() {
    return baseClient.get<any>('/request-log/car');
  },
  getHirePurchaseList(product_type: string) {
    return baseClient.get<any>('/companies/' + product_type);
  },
};
