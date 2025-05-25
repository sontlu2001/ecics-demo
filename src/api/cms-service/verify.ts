import cmsService from './api.config';

export default {
  verifyRestrictedUser({
    vehicle_registration_number,
    national_identity_no,
  }: {
    vehicle_registration_number?: string;
    national_identity_no?: string;
  }) {
    return cmsService.post<any>(`/api/customer-info`, {
      vehicle_registration_number,
      national_identity_no,
    });
  },
};
