'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import LimitedPeriodOffer from '@/app/(auth)/login/LimitedPeriodOffer';
import MyInfoLoginSection from '@/app/(auth)/login/MyInfoLoginSection';
import { useVerifyPromoCode } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const Login = () => {
  const { isMobile } = useDeviceDetection();
  const searchParams = useSearchParams();
  const promoCodeDefault =
    searchParams.get('promo_code')?.toUpperCase().trim() || '';

  const { mutate: verifyPromoCode, data: promoCodeData } = useVerifyPromoCode();

  useEffect(() => {
    if (promoCodeDefault) {
      verifyPromoCode(promoCodeDefault);
    }
  }, [promoCodeDefault, verifyPromoCode]);

  const showPromo =
    !!promoCodeDefault && promoCodeData?.data?.is_valid === true;

  if (isMobile) {
    return (
      <div className='relative min-h-[100svh]'>
        <img
          className='h-full w-full object-cover'
          src='/login_bg_top.svg'
          alt='Background Image'
        />
        <div className='text-center text-[18px] font-semibold leading-[100%] text-[#007AFF]'>
          Get an instant quote with Myinfo login
        </div>
        <MyInfoLoginSection />
        {showPromo && (
          <LimitedPeriodOffer
            promoCode={promoCodeDefault}
            promoCodeData={promoCodeData}
          />
        )}
        <img
          src='/login_bg_bottom.svg'
          alt='Background Image'
          className='absolute -bottom-8 w-full object-cover'
        />
      </div>
    );
  }

  return (
    <div className='relative flex h-screen w-full flex-row bg-white'>
      <div className='flex w-1/2 bg-white'>
        <img
          className='h-auto w-full object-cover'
          src='/login_bg_top.svg'
          alt='Background Top'
        />
      </div>
      <div className='relative z-10 flex w-1/2'>
        <div className='absolute bottom-0 w-full'>
          <img
            src='/login_bg_desktop.svg'
            alt='Background Bottom'
            className='w-full object-cover'
          />
        </div>
        <div className='relative z-10 mx-auto max-w-md content-center px-4'>
          <div className='mt-4 text-center text-2xl font-semibold text-primaryBlue'>
            Get an instant quote with <br />
            <span className='text-red-logo'>Myinfo</span> login
          </div>
          <div className='mt-4 text-center'>
            <span>
              Save time by securely retrieving your personal and vehicle details
              directly from Myinfo
            </span>
          </div>
          <MyInfoLoginSection />
          {showPromo && (
            <LimitedPeriodOffer
              promoCode={promoCodeDefault}
              promoCodeData={promoCodeData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
