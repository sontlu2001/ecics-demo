'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { formatPromoCode, saveToLocalStorage } from '@/libs/utils/utils';

import LimitedPeriodOffer from '@/components/page/login/LimitedPeriodOffer';
import MyInfoLoginSection from '@/components/page/login/MyInfoLoginSection';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { PARTNER_CODE, PROMO_CODE } from '@/constants/general.constant';
import { useVerifyPromoCode } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const LoginPage = () => {
  const { isMobile } = useDeviceDetection();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const productType: ProductType = pathname.startsWith('/maid')
    ? ProductType.MAID
    : ProductType.CAR;

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
  const { mutate: verifyPromoCode, data: promoCodeData } =
    useVerifyPromoCode(productType);

  useEffect(() => {
    if (promoCodeDefault) {
      verifyPromoCode(promoCodeDefault);
    }
  }, [promoCodeDefault, verifyPromoCode]);

  const showPromo =
    !!promoCodeDefault && promoCodeData?.data?.is_valid === true;

  const bgTop =
    productType === ProductType.MAID ? '/maid_bg_top.svg' : '/login_bg_top.svg';
  const bgMobile =
    productType === ProductType.MAID
      ? '/login_bg_singpass_maid.png'
      : '/login_bg_singpass.png';

  if (isMobile) {
    return (
      <div className='relative min-h-[100svh]'>
        <img
          className='h-full w-full object-cover'
          src={bgMobile}
          alt='Background Image'
        />
        <div
          className={`text-center text-[18px] font-semibold leading-[100%] text-[#007AFF]`}
        >
          Get an instant quote with your <br />
          <span className='ml-[4px] text-red-logo'>Personal Details</span>
        </div>
        <MyInfoLoginSection
          promoCode={promoCodeDefault}
          partnerCode={partnerCode}
          productType={productType}
        />
        {showPromo && (
          <LimitedPeriodOffer
            promoCode={promoCodeDefault}
            promoCodeData={promoCodeData}
            productType={productType}
          />
        )}
        <img
          src='/login_bg_bottom.svg'
          alt='Bottom BG'
          className='absolute -bottom-8 w-full object-cover'
        />
      </div>
    );
  }

  return (
    <div className='relative flex h-screen w-full flex-row bg-white'>
      <div className='flex w-2/3 bg-white'>
        <img className='h-auto w-full object-cover' src={bgTop} alt='Top BG' />
      </div>
      <div className='relative z-10 flex w-1/3'>
        <div className='absolute bottom-0 w-full'></div>
        <div className='relative z-10 mx-auto max-w-md content-center px-4'>
          <div className='flex w-full justify-center'>
            <img src='ecics.svg' alt='Logo' />
          </div>
          <div className='mt-4 text-center text-2xl font-semibold text-[#00adef]'>
            Get a quote with your <br />
            <span className='ml-[4px] text-red-logo'>Personal Details</span>
          </div>
          <MyInfoLoginSection
            promoCode={promoCodeDefault}
            partnerCode={partnerCode}
            productType={productType}
          />
          {showPromo && (
            <LimitedPeriodOffer
              promoCode={promoCodeDefault}
              promoCodeData={promoCodeData}
              productType={productType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
