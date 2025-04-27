import { useRouter } from 'next/navigation';
import React from 'react';

import TickCircleIcon from '@/components/icons/TickCircleIcon';
import { LinkButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

const ConfirmInfoCompletedModal = () => {
  const { isMobile } = useDeviceDetection();
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/login');
  };

  return (
    <div className='flex h-full flex-col justify-between p-6 text-center'>
      <div className='relative z-10 flex-grow'>
        {isMobile ? (
          <>
            <TickCircleIcon size={32} className='mx-auto text-[#10B707]' />
            <div className='mt-4 text-lg font-bold'>Progress Saved!</div>
          </>
        ) : (
          <div className='relative flex items-center justify-center'>
            <div className='absolute text-lg font-bold'>Progress Saved!</div>
            <TickCircleIcon
              size={24}
              className='absolute right-0 z-20 text-[#10B707]'
            />
          </div>
        )}
        <div
          className={`mt-8 ${isMobile ? 'text-sm' : 'rounded bg-gray-100 p-2 text-sm'}`}
        >
          A link has been sent to your email. Use it anytime to continue your
          car insurance journey.
        </div>
      </div>

      <div className='flex justify-center gap-4 bg-white pt-4'>
        <LinkButton type='link' onClick={handleGoBack}>
          Go Back to Home
        </LinkButton>
      </div>
    </div>
  );
};

export default ConfirmInfoCompletedModal;
