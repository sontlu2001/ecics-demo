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
      <div className='mt-6 rounded-lg border-2 border-secondaryBlue bg-white p-4'>
        <div className='text-2xl font-bold'>Limited period offer</div>
        <div>
          Flash Sale: Special discount available for the next 50 customers!
        </div>
        {description && (
          <div className='mt-2 text-base font-bold'>{description}</div>
        )}
        <div
          className={`mt-2 flex w-max flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 ${
            isMobile
              ? 'border-secondaryBlue bg-white text-secondaryBlue'
              : 'border-coupon-blue bg-coupon-blue text-white'
          }`}
        >
          <CouponIcon size={32} />
          <div className='text-base font-bold'>Coupon Code {promoCode}</div>
        </div>
      </div>
    </div>
  );
};

export default LimitedPeriodOffer;
