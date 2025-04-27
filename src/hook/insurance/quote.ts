import insurance from '@/api/base-service/insurance';
import { QuoteCreationPayload } from '@/libs/types/quote';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await insurance.getQuoteByKey(key);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
  });
};

export const useCreateQuote = () => {
  const createQuote = async (data: QuoteCreationPayload) => {
    const res = await insurance.createQuote(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: createQuote,
    mutationKey: ['quote'],
  });
};

export const useRequestLogCar = () => {
  const requestLogCar = async () => {
    const res = await insurance.requestLogCar();
    return res.data;
  };
  return useMutation({
    mutationFn: requestLogCar,
    mutationKey: ['log-car'],
  });
};
