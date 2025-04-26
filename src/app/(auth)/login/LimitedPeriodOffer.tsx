'use client';

import { Checkbox } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CouponIcon from '@/components/icons/CouponIcon';
import { LinkButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

const LimitedPeriodOffer = () => {
  const { isMobile } = useDeviceDetection();
  const router = useRouter();

  const handleContinueWithoutMyinfo = () => {
    router.push('/review-info-detail');
  };

  return (
    <div className='relative z-10 mx-auto max-w-md px-4'>
      <div className='flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20'>
        <p className='text-xl font-semibold'>Retrieve Myinfo with</p>
        <Image
          src='/singpass.svg'
          alt='Logo'
          width={100}
          height={100}
          className='pt-2'
        />
      </div>
      <div className='flex items-center justify-center gap-1 text-sm'>
        <span>or,</span>
        <LinkButton
          type='link'
          className='pl-0'
          onClick={handleContinueWithoutMyinfo}
        >
          continue without Myinfo login
        </LinkButton>
      </div>
      {isMobile && (
        <div className='mt-4 flex flex-wrap items-center justify-center gap-1 text-center text-sm'>
          <Checkbox className='custom-checkbox' />
          <span>By using this platform, you agree to our</span>
          <LinkButton type='link' className='pl-0'>
            Disclaimer
          </LinkButton>
        </div>
      )}
      <div className='mt-6 rounded-lg border-2 border-secondaryBlue bg-white p-4'>
        <div className='text-2xl font-bold'>Limited period offer</div>
        <div>
          Flash Sale: Special discount available for the next 50 customers!
        </div>
        <div className='mt-2 text-base font-bold'>
          15% discount on Car Insurance
        </div>
        <div
          className={`mt-2 flex w-max flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 ${
            isMobile
              ? 'border-secondaryBlue bg-white text-secondaryBlue'
              : 'border-coupon-blue bg-coupon-blue text-white'
          }`}
        >
          <CouponIcon size={32} />
          <div className='text-base font-bold'>Coupon Code CARS15</div>
        </div>
      </div>
    </div>
  );
};

export default LimitedPeriodOffer;
