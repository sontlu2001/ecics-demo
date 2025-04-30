import { QuoteResponse } from '@/libs/types/quote';

import baseClient from './api.config';
interface VerifyPromoCodeData {
  promo_code: string;
  product_type: string;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  verifyPartnerCode(partner_code: string) {
    return baseClient.get<any>('/partner/info/' + partner_code);
  },
  verifyPromoCode(data: VerifyPromoCodeData) {
    return baseClient.post<any>('/promo-code/validation', data);
  },
};
