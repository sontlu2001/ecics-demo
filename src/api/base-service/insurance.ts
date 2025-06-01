import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  ProposalPayload,
  QuoteCreationPayload,
  QuoteResponse,
} from '@/libs/types/quote';

import {
  API_GET_QUOTE_BY_KEY,
  API_POST_PERSONAL_INFO_SAVE,
  API_SAVE_QUOTE,
} from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getQuoteByKey(key: string) {
    return baseClient.get<QuoteResponse>(`${API_GET_QUOTE_BY_KEY}` + key);
  },
  generateQuote(data: QuoteCreationPayload) {
    return baseClient.post<QuoteResponse>('/car/quote', data);
  },
  saveProposal(data: ProposalPayload) {
    return baseClient.post<any>('/car/proposal', data);
  },
  saveQuote(key: string, data: any, is_sending_email: boolean) {
    const formatData = {
      data: { ...data },
      key: key,
      is_sending_email: is_sending_email,
    };
    return baseClient.post<QuoteResponse>(`${API_SAVE_QUOTE}`, formatData);
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
  saveProposalFinalize(data: { key: string }) {
    return baseClient.post<any>('/car/proposal/finalize', data);
  },
  payment(data: { key: string }) {
    return baseClient.post<any>('/payment', data);
  },
};
