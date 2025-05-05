import { useRouter } from 'next/navigation';
import React from 'react';

import WarningCircleIcon from '@/components/icons/WarningCircleIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const ConfirmInfoFailedModal = () => {
  const { isMobile } = useDeviceDetection();
  const router = useRouter();

  const handleGoBack = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className='flex h-full flex-col justify-between p-6 text-center'>
      <div className='relative z-10 flex-grow'>
        {isMobile ? (
          <>
            <WarningCircleIcon size={32} className='mx-auto text-[#F4333D]' />
            <div className='mt-4 text-lg font-bold'>Progress Not Saved!</div>
          </>
        ) : (
          <div className='relative flex items-center justify-center'>
            <div className='absolute text-lg font-bold'>
              Progress Not Saved!
            </div>
            <WarningCircleIcon
              size={24}
              className='absolute right-0 z-20 text-[#F4333D]'
            />
          </div>
        )}
        <div
          className={`mt-8 ${isMobile ? 'text-sm' : 'rounded bg-gray-100 p-2 text-sm'}`}
        >
          Please try and save your progress again. <br />
          Thank you.
        </div>
      </div>

      <div className='flex justify-center gap-4 bg-white pt-4'>
        <PrimaryButton onClick={handleGoBack} className='w-full'>
          Okay
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ConfirmInfoFailedModal;
