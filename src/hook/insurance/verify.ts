import verify from '@/api/base-service/verify';
import { useQuery } from '@tanstack/react-query';

export const useVerifyPartnerCode = (partner_code: string) => {
  const fetchQuote = async () => {
    const res = await verify.verifyPartnerCode(partner_code);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', partner_code],
    enabled: false,
  });
};

export const useVerifyPromoCode = (promo_code: string) => {
  const fetchQuote = async () => {
    const res = await verify.verifyPromoCode({
      promo_code,
      product_type: 'motor',
    });
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['promo', promo_code],
    enabled: false,
  });
};
