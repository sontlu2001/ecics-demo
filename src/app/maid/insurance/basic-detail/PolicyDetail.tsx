'use client';

import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { formatPromoCode, generateKeyAndAttachToUrl } from '@/libs/utils/utils';

import { MAID_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { useGenerateMaidQuote } from '@/hook/insurance/maidQuote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { setPromoCodeError } from '@/redux/slices/general.slice';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import PolicyDetailForm from './PolicyDetailForm';

interface PolicyDetailProps {
  onSaveRegister: (fn: () => any) => void;
  isSingPassFlow: boolean;
}

export const PolicyDetail = ({
  isSingPassFlow = false,
  onSaveRegister,
}: PolicyDetailProps) => {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const promo_code = formatPromoCode(searchParams.get('promo_code'));
  const initKey = searchParams.get('key') || '';
  const [key, setKey] = useState(initKey);

  const maidQuote = useAppSelector((state) => state.maidQuote?.maidQuote);
  const { mutateAsync: generateMaidQuote, isPending } = useGenerateMaidQuote();
  const userInfo = maidQuote?.data?.personal_info;
  const maidInfo = maidQuote?.data?.maid_info;
  const insuranceInfo = maidQuote?.data?.insurance_other_info;
  const savedPromoCode = maidQuote?.promo_code;

  const planPeriodMap: Record<string, string> = {
    '26 Months': '26',
    '14 Months': '14',
  };

  const initialValues = {
    [MAID_QUOTE.email]: userInfo?.email ?? '',
    [MAID_QUOTE.mobile]: userInfo?.phone ?? '',
    [MAID_QUOTE.maid_type]: insuranceInfo?.maid_type ?? '',
    [MAID_QUOTE.plan_period]:
      planPeriodMap[insuranceInfo?.plan_period] ??
      insuranceInfo?.plan_period ??
      '',
    [MAID_QUOTE.start_date]: insuranceInfo?.start_date
      ? dayjs(insuranceInfo?.start_date, 'DD/MM/YYYY').toDate()
      : undefined,
    [MAID_QUOTE.end_date]: maidQuote?.end_date
      ? dayjs(maidQuote?.end_date, 'DD/MM/YYYY').toDate()
      : undefined,
    [MAID_QUOTE.nationality]: maidInfo?.nationality ?? '',
    [MAID_QUOTE.maid_dob]: maidInfo?.date_of_birth
      ? dayjs(maidInfo?.date_of_birth, 'DD/MM/YYYY').toDate()
      : undefined,
    [MAID_QUOTE.promo_code]: savedPromoCode?.code ?? promo_code ?? '',
  };

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    dispatch(setPromoCodeError(null));
    let payload: any;
    const updateLoadMaidInfo = {
      ...maidInfo,
      ...data?.maid_info,
    };
    payload = { ...data, key: key, maid_info: updateLoadMaidInfo };
    const startDateStr = data.start_date;
    const planPeriodStr = data.plan_period;
    let endDate = null;
    if (startDateStr && planPeriodStr) {
      const monthsMatch = planPeriodStr.match(/(\d+)/);
      const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 0;
      const startDate = dayjs(startDateStr, 'DD/MM/YYYY');
      if (startDate.isValid() && months > 0) {
        endDate = startDate.add(months, 'month').format('DD/MM/YYYY');
        payload.end_date = endDate;
      }
    }
    if (isSingPassFlow && userInfo) {
      // data from Singpass
      const personal_info = {
        name: userInfo?.name,
        gender: userInfo?.gender,
        marital_status: userInfo?.marital_status,
        date_of_birth: userInfo?.date_of_birth,
        nric: userInfo?.nric?.toUpperCase(),
        address: userInfo?.address,
        phone: userInfo?.phone,
        email: userInfo?.email?.toLowerCase(),
        post_code: userInfo?.post_code,
      };

      payload = {
        ...payload,
        personal_info: personal_info,
        maid_info: updateLoadMaidInfo,
      };
    }
    generateMaidQuote(payload)
      .then((res) => {
        if (res) {
          dispatch(updateMaidQuote({ ...res, end_date: endDate }));
          router.push(ROUTES.INSURANCE_MAID.PLAN);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 422) {
          dispatch(setPromoCodeError(err.response.data));
        } else {
          console.error('Unexpected error:', err);
        }
      });
  };

  return (
    <div className='mt-4 w-full'>
      <PolicyDetailForm
        onSubmit={onSubmit}
        isSingpassFlow={isSingPassFlow}
        isLoading={isPending}
        initialValues={initialValues}
        onSaveRegister={onSaveRegister}
      />
    </div>
  );
};
