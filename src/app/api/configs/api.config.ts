import axios from 'axios';
import logger from '../libs/logger';

const TOKEN_EXPIRED_STATUS = -114;
const TOKEN_NOT_FOUND_STATUS = -106;
let token = '';

// Create axios instance with base URL and headers
const apiServer = axios.create({
  baseURL: process.env.ISP_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Refresh token function
async function refreshToken() {
  try {
    const email = process.env.ISP_EMAIL;
    const mpwd = process.env.ISP_MPWD;
    const response = await axios.post(`${process.env.ISP_API_URL}/auth`, {
      email,
      mpwd,
    });
    token = response.data.data.token;

    logger.info(`Token refreshed successfully: ${token}`);
    return token;
  } catch (error) {
    logger.error('Error refreshing token:', error);
    throw error;
  }
}

// Add request interceptor
apiServer.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers['In-Auth-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor
apiServer.interceptors.response.use(
  (response) => {
    if (
      response.data.status === TOKEN_EXPIRED_STATUS ||
      response.data.status === TOKEN_NOT_FOUND_STATUS
    ) {
      logger.warn('Token expired or not found. Refreshing...');
      return refreshToken().then((newToken) => {
        response.config.headers.Authorization = `Bearer ${newToken}`;
        return apiServer(response.config);
      });
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

export default apiServer;
