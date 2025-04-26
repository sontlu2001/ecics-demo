import axios from 'axios';

const singpassService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SINGPASS_SERVICE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

singpassService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

singpassService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default singpassService;
