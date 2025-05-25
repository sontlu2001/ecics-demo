'use client';

import CouponIcon from '@/components/icons/CouponIcon';

import { PromoCodeResponse } from '@/api/base-service/verify';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type LimitedPeriodOfferProps = {
  promoCode: string;
  promoCodeData: PromoCodeResponse;
};

const LimitedPeriodOffer = ({
  promoCode,
  promoCodeData,
}: LimitedPeriodOfferProps) => {
  const { isMobile } = useDeviceDetection();
  const description = promoCodeData?.data?.description;

  return (
    <div className='relative z-10 mx-auto max-w-md px-4'>
      <div className='mt-6 rounded-[5px] border-2 border-[#00ADEF] bg-white p-4'>
        <div className='mb-[8px] text-[16px] font-bold leading-[100%]'>
          Limited period offer
        </div>
        <div>
          Flash Sale: Special discount available for the next 50 customers!
        </div>
        {description && (
          <div className='mt-2 text-[14px] text-base font-bold'>
            {description}
          </div>
        )}
        <div
          className={`mt-2 flex w-max flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 ${
            isMobile
              ? 'border-[#00ADEF] bg-white text-[#00ADEF]'
              : 'border-coupon-blue bg-coupon-blue text-white'
          }`}
        >
          <CouponIcon size={32} />
          <div className='text-[12px] text-base font-bold'>
            Coupon Code {promoCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitedPeriodOffer;
