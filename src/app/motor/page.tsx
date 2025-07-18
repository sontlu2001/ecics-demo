'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { formatPromoCode, saveToLocalStorage } from '@/libs/utils/utils';

import { PARTNER_CODE, PROMO_CODE } from '@/constants/general.constant';
import { useVerifyPromoCode } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import LimitedPeriodOffer from './LimitedPeriodOffer';
import MyInfoLoginSection from './MyInfoLoginSection';

const MotorPage = () => {
  const { isMobile } = useDeviceDetection();
  const searchParams = useSearchParams();
  const partnerCode = searchParams.get('partner_code') || '';
  const promoCodeDefault = formatPromoCode(searchParams.get('promo_code'));
  useEffect(() => {
    if (partnerCode) {
      saveToLocalStorage({ [PARTNER_CODE]: partnerCode });
    }
    if (promoCodeDefault) {
      saveToLocalStorage({ [PROMO_CODE]: promoCodeDefault });
    }
  }, [partnerCode, promoCodeDefault]);

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
          src='/login_bg_singpass.png'
          alt='Background Image'
        />
        <div className='text-center text-[18px] font-semibold leading-[100%] text-[#007AFF]'>
          Get an instant quote with your <br />
          <span className='ml-[4px] text-red-logo'>Personal Details</span>
        </div>
        <MyInfoLoginSection
          promoCode={promoCodeDefault}
          partnerCode={partnerCode}
        />
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
      <div className='flex w-2/3 bg-white'>
        <img
          className='h-auto w-full object-cover'
          src='/login_bg_top.svg'
          alt='Background Top'
        />
      </div>
      <div className='relative z-10 flex w-1/3'>
        <div className='absolute bottom-0 w-full'></div>
        <div className='relative z-10 mx-auto max-w-md content-center px-4'>
          <div className='flex w-full justify-center'>
            <img src='ecics.svg' />
          </div>
          <div className='mt-4 text-center text-2xl font-semibold text-[#00adef]'>
            Get a quote with your <br />
            <span className='ml-[4px] text-red-logo'>Personal Details</span>
          </div>
          {/*<div className='mt-4 text-center text-lg font-semibold text-[#00adef]'>*/}
          {/*    Get an instant quote with*/}
          {/*    <span className='text-red-logo'> Myinfo</span> login*/}
          {/*</div>*/}
          {/*<div className='mt-4 text-center'>*/}
          {/*  <span>*/}
          {/*    Save time by securely retrieving your personal and vehicle details*/}
          {/*    directly from Myinfo*/}
          {/*  </span>*/}
          {/*</div>*/}
          <MyInfoLoginSection
            promoCode={promoCodeDefault}
            partnerCode={partnerCode}
          />
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

export default MotorPage;
