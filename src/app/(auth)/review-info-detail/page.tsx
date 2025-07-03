'use client';

import { useEffect, useState } from 'react';

import ReviewInfoDetail from '@/app/(auth)/review-info-detail/ReviewInfoDetail';
import { usePostUserInfo } from '@/hook/auth/login';

export default function ReviewInfoDetailPage() {
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

  if (!clientReady || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ReviewInfoDetail />
    </div>
  );
}
