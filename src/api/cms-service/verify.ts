import {
  API_GET_PAYMENT_SUMMARY_DATA,
  API_POST_VERIFY_RESTRICTED_USER,
} from '@/constants/api.constant';

import cmsService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  verifyRestrictedUser({
    vehicle_registration_number,
    national_identity_no,
  }: {
    vehicle_registration_number?: string;
    national_identity_no?: string;
  }) {
    return cmsService.post<any>(`${API_POST_VERIFY_RESTRICTED_USER}`, {
      vehicle_registration_number,
      national_identity_no,
    });
  },
  getPaymentSummaryData(product_type: string) {
    const token = process.env.NEXT_PUBLIC_API_CMS_TOKEN;

    return cmsService.get(`${API_GET_PAYMENT_SUMMARY_DATA}`, {
      params: { product_type },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
