'use client';

import { SecondaryButton } from '@/components/ui/buttons';

interface AddOnPricingSummaryProps {
  onContinue?: () => void;
}

const AddOnPricingSummary: React.FC<AddOnPricingSummaryProps> = ({
  onContinue,
}) => {
  return (
    <div className='mt-2 md:px-44'>
      <div className='mt-2 flex w-full flex-row items-center justify-between rounded-t-md border border-[#DEE1E6] px-4 py-3 shadow-lg'>
        <div className='flex flex-col gap-2'>
          <p className='text-[18px] font-semibold leading-6 md:text-[28px] md:font-bold'>
            S$ 2700{' '}
            <span className='text-[15px] text-[#FF0004] line-through md:text-[20px] md:font-normal'>
              $3200
            </span>
          </p>
          <p className='text-[12px] font-semibold text-[#0096D8] md:text-[16px]'>
            Premium breakdown
          </p>
        </div>
        <SecondaryButton
          htmlType='button'
          className='rounded-xl bg-[#00ADEF] px-6 leading-4 text-white'
          onClick={onContinue}
        >
          Continue
        </SecondaryButton>
      </div>
    </div>
  );
};

export default AddOnPricingSummary;
