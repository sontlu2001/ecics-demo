'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { usePostUserInfoMaid } from '@/hook/auth/login-maid';
import { ReviewInfoDetailMaid } from './ReviewInfoDetail';
import { DATA_FROM_SINGPASS } from '@/constants/general.constant';
import { MAID_QUOTE } from '@/constants';

export default function ReviewInfoDetailPage() {
  const [params, setParams] = useState({ code: '', state: '' });
  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
  });

  const [clientReady, setClientReady] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem(DATA_FROM_SINGPASS);
      if (storedData) {
        setPersonalInfo(JSON.parse(storedData));
        setClientReady(true);
        return;
      }
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code') || '';
      const state = query.get('state') || '';
      const code_verifier = sessionStorage.getItem('code_verifier') || '';
      const nonce = sessionStorage.getItem('nonce') || '';

      setParams({ code, state });
      setPayload({ code_verifier, nonce, state });
      setClientReady(true);
    }
  }, []);

  const { data, isLoading } = usePostUserInfoMaid({
    params,
    payload,
  });

  useEffect(() => {
    if (data) {
      setPersonalInfo(data);
    }
  }, [data]);

  const initialValues = {
    [MAID_QUOTE.email]: personalInfo?.email?.value || '',
    [MAID_QUOTE.mobile]: personalInfo?.mobileno?.nbr?.value || '',
    [MAID_QUOTE.name]: personalInfo?.name?.value || '',
    [MAID_QUOTE.nationality]: personalInfo?.nationality?.desc || '',
    dob: personalInfo?.dob?.value || '',
    uinfin: personalInfo?.uinfin?.value || '',
    address1:
      personalInfo?.regadd?.block?.value && personalInfo?.regadd?.street?.value
        ? `${personalInfo.regadd.block.value} ${personalInfo.regadd.street.value}`
        : '',
    address2: personalInfo?.regadd?.building?.value || '',
    address3:
      personalInfo?.regadd?.floor?.value && personalInfo?.regadd?.unit?.value
        ? `${personalInfo.regadd.floor.value}-${personalInfo.regadd.unit.value}`
        : '',
    postal: personalInfo?.regadd?.postal?.value || '',
  };

  if (!clientReady || (!personalInfo && isLoading)) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='relative flex w-full justify-center p-4 pb-0 md:px-10'>
      <ReviewInfoDetailMaid
        personalInfo={personalInfo}
        initialValues={initialValues}
      />
    </div>
  );
}
