import { formatCurrency } from '@/libs/utils/utils';

import { PrimaryButton } from '@/components/ui/buttons';

export function PricingSummary({
  planFee,
  addonFee = 0,
  discount, // 10% = 10, 0% = 0
  title,
  textButton,
  onClick,
  setIsShowPopupPremium,
  loading,
}: {
  planFee: number;
  addonFee?: number;
  discount: number;
  title?: string;
  textButton?: string;
  loading?: boolean;
  onClick?: () => void;
  setIsShowPopupPremium?: (isShowPopupPremium: boolean) => void;
}) {
  const discountFee = planFee + addonFee;
  const notDiscountFee = planFee / (1 - discount / 100) + addonFee;

  return (
    <div
      className='w-full md:flex md:flex-row md:justify-center '
      onClick={() => setIsShowPopupPremium?.(true)}
    >
      <div className='item-center fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 transform justify-center border-[1px] border-gray-100 bg-white shadow-md shadow-gray-200'>
        <div className='flex w-full items-center justify-between border-t-2 bg-white px-4 py-2 md:max-w-[900px] md:border-none md:py-4'>
          <div className='flex flex-col gap-1'>
            <p className='flex flex-row gap-1 text-lg font-semibold leading-6 text-[#323743] md:flex-row md:gap-2 md:text-3xl md:font-bold md:text-[#1B223C]'>
              <span className='text-[18px] font-semibold text-[#323743] md:text-3xl md:font-bold md:text-[#1B223C]'>
                {discountFee
                  ? formatCurrency(Number(discountFee.toFixed(2)))
                  : ''}{' '}
              </span>
              {discount > 0 && (
                <span className='text-[14px] font-normal text-[#FF0004] line-through md:text-[20px] md:text-[#EF0000]'>
                  {formatCurrency(notDiscountFee)}
                </span>
              )}
            </p>
            <p className='text-[12px] font-semibold text-[#0096D8] md:text-[16px]'>
              {title}
            </p>
          </div>

          <PrimaryButton
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
            className='px-1 leading-4 text-white md:mt-5 md:w-40'
            loading={loading}
          >
            {textButton || 'Continue'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
