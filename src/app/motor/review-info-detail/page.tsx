'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { usePostUserInfo } from '@/hook/auth/login';

import ReviewInfoDetail from './ReviewInfoDetail';

export default function ReviewInfoDetailPage() {
  const dispatch = useDispatch();
  const [params, setParams] = useState({ code: '', state: '' });
  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
  });
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  const { data, isLoading } = usePostUserInfo({
    params,
    payload,
  });

  // useEffect(() => {
  //     if (data) {
  //         dispatch(setUserInfoCar(data));
  //     }
  // }, [data, dispatch]);

  if (!clientReady || isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div>
      <ReviewInfoDetail />
    </div>
  );
}
