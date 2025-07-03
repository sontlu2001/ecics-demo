import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  ProposalPayload,
  QuoteCreationPayload,
  QuoteResponse,
} from '@/libs/types/quote';

import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  API_GET_HIRE_PURCHASE_LIST,
  API_GET_QUOTE_BY_KEY,
  API_GET_REQUEST_LOG,
  API_POST_PAYMENT,
  API_POST_PERSONAL_INFO_SAVE,
  API_POST_ZIP_FILES_DOWNLOAD,
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
  saveProposal(data: ProposalPayload, productType: ProductTypeWeb) {
    const url = `/${productType}/proposal`;
    return baseClient.post<any>(url, data);
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
  requestLog(product_type: string) {
    return baseClient.get<any>(`${API_GET_REQUEST_LOG}` + product_type);
  },
  getHirePurchaseList(product_type: string) {
    return baseClient.get<any>(`${API_GET_HIRE_PURCHASE_LIST}` + product_type);
  },
  saveProposalFinalize(data: { key: string }) {
    return baseClient.post<any>('/car/proposal/finalize', data);
  },
  payment(data: { key: string }) {
    return baseClient.post<any>(`${API_POST_PAYMENT}`, data);
  },
  postZipFilesDownload(data: { documents: string[] }) {
    return baseClient.post<Blob>(`${API_POST_ZIP_FILES_DOWNLOAD}`, data, {
      responseType: 'blob',
    });
  },
};
