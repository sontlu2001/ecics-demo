'use client';

import CouponIcon from '@/components/icons/CouponIcon';

import { PromoCodeResponse } from '@/api/base-service/verify';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type LimitedPeriodOfferProps = {
  promoCode: string;
  promoCodeData: PromoCodeResponse;
  productType: ProductType;
};

const LimitedPeriodOffer = ({
  promoCode,
  promoCodeData,
  productType,
}: LimitedPeriodOfferProps) => {
  const { isMobile } = useDeviceDetection();
  const description = promoCodeData?.data?.description;
  const isMaid = productType === ProductType.MAID;

  return (
    <div className='relative z-10 mx-auto max-w-md px-4'>
      <div
        className='mt-6 rounded-[10px] bg-white p-4 shadow-xl'
        style={{ borderLeft: '8px solid #C80F1E' }}
      >
        <div className='mb-[8px] text-2xl font-bold leading-[100%]'>
          {isMaid
            ? 'Fuel Your Savings – But Only If You’re Fast!'
            : 'Don’t Let This Deal Dust Off Without You!'}
        </div>
        <div className='text-justify text-sm'>
          {isMaid ? (
            <>
              Snag{' '}
              <span className='font-bold'>
                {promoCodeData?.data?.discount}% OFF
              </span>{' '}
              Maid Insurance for the next 50 employers. Use the code and tidy up
              your savings!
            </>
          ) : (
            <>
              Just 50 spots left to save{' '}
              <span className='font-bold'>
                {promoCodeData?.data?.discount}%
              </span>{' '}
              on Car Insurance. Use the code below before this deal runs out of
              road.
            </>
          )}
        </div>
        {description && (
          <div className='mt-2 text-[14px] text-base font-bold'>
            {description}
          </div>
        )}
        <div
          className={`mt-2 flex w-max flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 ${
            isMobile
              ? 'border-[#C80F1E] bg-white text-[#C80F1E]'
              : 'border-coupon-red bg-coupon-red text-white'
          }`}
        >
          <CouponIcon size={32} />
          <div className='text-[12px] text-base font-bold'>{promoCode}</div>
        </div>
      </div>
    </div>
  );
};

export default LimitedPeriodOffer;
