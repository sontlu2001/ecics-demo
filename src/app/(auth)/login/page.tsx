'use client';

import { useEffect } from 'react';

import Login from '@/app/(auth)/login/Login';

export default function LoginPage() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}
