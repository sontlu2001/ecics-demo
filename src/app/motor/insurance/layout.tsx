'use client';
import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';
import { date } from 'zod';

import { useGetQuote } from '@/hook/insurance/quote';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch } from '@/redux/store';

interface InsuranceLayoutProps {
  children: ReactNode;
}

const InsuranceLayout = ({ children }: InsuranceLayoutProps) => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const key = params.get('key') || '';
  const { data, isLoading } = useGetQuote(key);

  useEffect(() => {
    if (!date || !data) return;
    dispatch(updateQuote(data));
  }, [data]);

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return <div className='insurance-layout'>{children}</div>;
};

export default InsuranceLayout;
