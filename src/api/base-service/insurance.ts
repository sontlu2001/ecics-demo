import baseClient from './api.config';

export default {
  createQuote() {
    return baseClient.get('/quotes');
  },
};
