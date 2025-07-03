'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LinkButton } from '@/components/ui/buttons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { useRequestLogin } from '@/hook/auth/login';
import { useRequestLog } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRequestLoginMaid } from '@/hook/auth/login-maid';

interface MyInfoLoginSectionProps {
  promoCode?: string;
  partnerCode?: string;
  productType: ProductType;
}

const MyInfoLoginSection = ({
  promoCode,
  partnerCode,
  productType,
}: MyInfoLoginSectionProps) => {
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const [isUserActive, setIsUserActive] = useState(false);
  const isMaid = productType === ProductType.MAID;

  const { mutate: requestLogin } = useRequestLogin();
  const { mutate: requestLoginMaid } = useRequestLoginMaid();

  const { mutate: requestLog } = useRequestLog(
    isMaid ? PRODUCT_NAME.MAID : PRODUCT_NAME.CAR,
  );

  const handleLogin = () => {
    setIsUserActive(true);
    {
      isMaid ? requestLoginMaid() : requestLogin();
    }
    requestLog();
  };

  const handleContinueWithoutMyinfo = () => {
    setIsUserActive(true);
    requestLog();

    const basePath = isMaid
      ? ROUTES.INSURANCE_MAID.BASIC_DETAIL_MANUAL
      : ROUTES.INSURANCE.BASIC_DETAIL_MANUAL;

    const queryParams = new URLSearchParams();
    if (promoCode) queryParams.append('promo_code', promoCode);
    if (partnerCode) queryParams.append('partner_code', partnerCode);

    const queryString = queryParams.toString();

    router.push(`${basePath}${queryString ? `&${queryString}` : ''}`);
  };

  return (
    <div className='relative z-10 mx-auto mt-[2px] max-w-md px-4'>
      <button
        className='mx-auto flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20'
        onClick={handleLogin}
      >
        <p className='text-xl font-semibold'>Retrieve Myinfo with</p>
        <img
          src='/singpass.svg'
          alt='Logo'
          width={100}
          height={100}
          className='pt-2'
        />
      </button>
      <div className='flex items-center justify-center gap-1 text-sm'>
        <span>or,</span>
        <LinkButton
          type='link'
          className={`pl-0 ${isMobile ? 'text-[14px] font-normal leading-[100%] text-[#00ADEF]' : ''}`}
          onClick={handleContinueWithoutMyinfo}
        >
          continue without Myinfo login
        </LinkButton>
      </div>

      <div
        className={`mt-4 flex flex-wrap items-center justify-center gap-1 text-center ${isMobile ? 'text-xs font-normal' : 'text-xs'}`}
      >
        <span>
          By continuing, you agree to our <br className='block md:hidden' />
          <LinkButton
            type='link'
            className='h-0 text-wrap px-0 text-xs'
            href='https://www.ecics.com/documents/website-use-terms-and-conditions.pdf'
            target='_blank'
          >
            Terms of Use
          </LinkButton>
          {' and '}
          <LinkButton
            type='link'
            className='h-0 text-wrap px-0 text-xs'
            href='https://www.ecics.com/privacy-policy'
            target='_blank'
          >
            Privacy Policy
          </LinkButton>
        </span>
      </div>
    </div>
  );
};

export default MyInfoLoginSection;
