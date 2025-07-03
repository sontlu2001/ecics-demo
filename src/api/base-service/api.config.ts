import axios from 'axios';

import { ROUTES } from '@/constants/routes';

const baseClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

baseClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

baseClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.statusText;
    if (status === 500 || status === 503) {
      window.location.href = `${ROUTES.API_ERROR}?status=${status}&message=${encodeURIComponent(message)}`;
    }
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default baseClient;
