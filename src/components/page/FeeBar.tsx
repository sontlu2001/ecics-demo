import { Button } from 'antd';
import { useEffect } from 'react';

import { formatCurrency } from '@/libs/utils/utils';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { setIsLoadingStep } from '@/redux/slices/general.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export function PricingSummary({
  isBasicDetailScreen,
  planFee = 0,
  addonFee = 0,
  discount = 0, // 10% = 10, 0% = 0
  title,
  textButton,
  onClick,
  handleBack,
  setIsShowPopupPremium,
  productType,
  loading,
  isPlan,
}: {
  isBasicDetailScreen?: boolean;
  planFee?: number;
  addonFee?: number;
  discount?: number;
  title?: string;
  textButton?: string;
  loading?: boolean;
  onClick?: () => void;
  handleBack?: () => void;
  productType: ProductType;
  setIsShowPopupPremium?: (isShowPopupPremium: boolean) => void;
  isPlan?: boolean;
  titlePlan?: string;
}) {
  const discountFee = planFee + addonFee;
  const notDiscountFee = planFee / (1 - discount / 100) + addonFee;
  const { isMobile } = useDeviceDetection();
  const dispatch = useAppDispatch();
  const quoteInfo = useAppSelector((state) => state.quote?.quote);
  const maidQuote = useAppSelector((state) => state.maidQuote?.maidQuote);

  const currentQuote = productType === ProductType.MAID ? maidQuote : quoteInfo;
  const selectedPlan = currentQuote?.data?.selected_plan;

  useEffect(() => {
    if (!loading) {
      dispatch(setIsLoadingStep(false));
    }
  }, [loading, dispatch]);

  return (
    <div
      className={`w-full md:flex md:flex-row md:justify-center ${isBasicDetailScreen ? '' : 'cursor-pointer'}`}
    >
      <div className='item-center fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 transform justify-center border-[1px] border-gray-100 bg-white shadow-md shadow-gray-200'>
        <div
          className={`w-full border-t-2 bg-white px-4 md:border-none md:py-4 ${isBasicDetailScreen ? 'py-3 md:max-w-[1240px]' : 'py-2  md:max-w-7xl'}`}
        >
          {isMobile ? (
            <div className='flex w-full flex-col items-center gap-3'>
              {!isBasicDetailScreen && (
                <div
                  className='flex w-full items-center justify-between'
                  onClick={() => setIsShowPopupPremium?.(true)}
                >
                  <div>
                    <p className='max-w-[150px] text-[16px] font-bold text-[#080808]'>
                      {isPlan ? title : selectedPlan}{' '}
                      {productType === ProductType.MAID && 'Plan'}
                    </p>
                    {!isPlan && (
                      <p className='text-[12px] font-semibold leading-[26px] text-[#00ADEF] underline'>
                        {title}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className='flex flex-row gap-1 text-lg font-semibold leading-6 text-[#323743] md:flex-row md:gap-2 md:text-3xl md:font-bold md:text-[#1B223C]'>
                      {discount > 0 && (
                        <span className='text-[14px] font-normal text-[#FF0004] line-through md:text-[20px] md:text-[#EF0000]'>
                          {formatCurrency(notDiscountFee)}
                        </span>
                      )}
                      <div className=''>
                        <span className='text-[18px] font-semibold text-[#323743] md:text-3xl md:font-bold md:text-[#1B223C]'>
                          {discountFee
                            ? formatCurrency(Number(discountFee.toFixed(2)))
                            : ''}{' '}
                        </span>
                        <p className='text-[12px] font-semibold text-[#323743]'>
                          (inclusive of GST)
                        </p>
                      </div>
                    </p>
                  </div>
                </div>
              )}
              <div className='flex w-full items-center'>
                <Button
                  color='cyan'
                  icon={<ArrowBackIcon size={16} />}
                  shape='circle'
                  className='mr-[6px] border-none bg-gray-200 pt-[6px]'
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBack?.();
                  }}
                />
                <PrimaryButton
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setIsLoadingStep(true));
                    onClick && onClick();
                  }}
                  className='w-full bg-[#2ECC71] px-1 leading-4 text-white md:mt-5'
                  loading={loading}
                >
                  {textButton || 'Continue'}
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <Button
                color='cyan'
                icon={<ArrowBackIcon size={16} />}
                shape='circle'
                disabled={loading}
                className='border-none bg-gray-200 pt-[6px]'
                onClick={(e) => {
                  e.stopPropagation();
                  handleBack?.();
                }}
              />
              {!isBasicDetailScreen && (
                <>
                  <div
                    className='flex flex-row items-center sm:min-w-[300px] md:gap-1 lg:min-w-[574px] lg:gap-28'
                    onClick={() => setIsShowPopupPremium?.(true)}
                  >
                    <div className='flex max-w-[246px] flex-col md:min-w-[246px]'>
                      <p className='text-[24px] font-bold leading-[35px] text-[#080808]'>
                        {isPlan ? title : selectedPlan}{' '}
                        {productType === ProductType.MAID && 'Plan'}
                      </p>
                      {!isPlan && (
                        <p className='text-[12px] font-semibold leading-[26px] text-[#00ADEF] underline'>
                          {title}
                        </p>
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex flex-row gap-2'>
                        {discount > 0 && (
                          <span className='text-[14px] font-normal leading-[26px] text-[#FF0004] line-through'>
                            {formatCurrency(notDiscountFee)}
                          </span>
                        )}

                        <span className='text-[18px] font-semibold leading-[30px] text-[#323743]'>
                          {discountFee
                            ? formatCurrency(Number(discountFee.toFixed(2)))
                            : ''}{' '}
                        </span>
                      </div>
                      <p className='flex justify-end text-[12px] font-semibold leading-[26px]'>
                        (inclusive of GST)
                      </p>
                    </div>
                  </div>
                </>
              )}
              <PrimaryButton
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setIsLoadingStep(true));
                  onClick && onClick();
                }}
                className={`bg-[#2ECC71] px-1 leading-4 text-white md:w-40 ${isBasicDetailScreen ? 'md:mb-2.5 md:mt-2.5' : 'md:mt-5'}`}
                loading={loading}
              >
                {textButton || 'Continue'}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
