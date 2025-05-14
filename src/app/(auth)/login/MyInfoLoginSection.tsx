'use client';

import { Checkbox } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LinkButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useRequestLogin } from '@/hook/auth/login';
import { useRequestLogCar } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const MyInfoLoginSection = () => {
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const [isDegreedWithDisclaimer, setIsDegreedWithDisclaimer] = useState(false);
  const [isUserActive, setIsUserActive] = useState(false);

  const { mutate: requestLogin } = useRequestLogin();
  const { mutate: requestLogCar } = useRequestLogCar();

  const handleLogin = () => {
    setIsUserActive(true);
    if (!isDegreedWithDisclaimer) return;
    requestLogin();
    requestLogCar();
  };

  const handleContinueWithoutMyinfo = () => {
    setIsUserActive(true);
    if (!isDegreedWithDisclaimer) return;
    requestLogCar();
    router.push(ROUTES.INSURANCE.BASIC_DETAIL_MANUAL);
  };

  return (
    <div className='relative z-10 mx-auto mt-[2px] max-w-md px-4'>
      <button
        className='flex items-center gap-2 justify-self-center rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20'
        onClick={handleLogin}
      >
        <p className='text-xl font-semibold'>Retrieve Myinfo with</p>
        <Image
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
        className={`mt-4 flex flex-wrap items-center justify-center gap-1 text-center ${isMobile ? 'text-[12px] font-normal' : 'text-sm'}`}
      >
        <Checkbox
          className='custom-checkbox'
          checked={isDegreedWithDisclaimer}
          onChange={(e) => setIsDegreedWithDisclaimer(e.target.checked)}
        />
        <span>By using this platform, you agree to our</span>
        <LinkButton
          type='link'
          className={`pl-0 ${isMobile ? 'text-[12px] font-normal leading-[100%]' : ''}`}
        >
          Disclaimer
        </LinkButton>
      </div>
      {!isDegreedWithDisclaimer && isUserActive && (
        <p className='text-center text-xs text-red-500'>
          Please read and agree with disclaimer term before continues
        </p>
      )}
    </div>
  );
};

export default MyInfoLoginSection;
