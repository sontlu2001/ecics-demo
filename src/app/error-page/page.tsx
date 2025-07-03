'use client';

import { useEffect, useState } from 'react';

export default function ApiErrorPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      setStatus(params.get('status'));
      setMessage(params.get('message'));
    }
  }, []);

  return (
    <div
      className='relative flex min-h-screen w-full flex-col bg-white'
      style={{
        backgroundImage: "url('/img-error.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain',
      }}
    >
      <div className='max-w-[700px] px-4 pt-10 md:pl-24 md:pt-20'>
        <img src='/ecics.svg' alt='ecics logo' className='mb-8 h-10' />
        <p className='mb-2 w-full text-[32px] font-bold leading-[100%] text-[#000000]'>
          {status} {message}
        </p>
        <p className='mb-4 text-[20px] font-normal text-[#000000]'>
          Service is temporarily unavailable. Please try again shortly.
        </p>
        <p className='mb-6 text-base font-normal leading-[100%] text-[#00000073]'>
          Our team is ready to assist you—please don't hesitate to reach out and
          we'll do our best to resolve the issue as quickly as possible.
        </p>
        <div className='space-y-1 text-base  font-normal'>
          <p>
            <span className='mr-2'>📞</span>
            <a href='tel:+65 6206 5588' className='text-[#00000073]'>
              Call us: +65 6206 5588
            </a>
          </p>
          <p>
            <span className='mr-2'>📧</span>
            <span className='text-[#00000073]'>Email us:</span>
            <a
              href='mailto:customerservice@ecics.com.sg'
              className='text-[#00000073] underline'
            >
              customerservice@ecics.com.sg
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
