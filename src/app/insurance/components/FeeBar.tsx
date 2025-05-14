import { PrimaryButton } from '@/components/ui/buttons';
import { Button } from 'antd';

export function PricingSummary({
  fee,
  discount, // 10% = 10, 0% = 0
  title,
  textButton,
  onClick,
}: {
  fee: number;
  discount: number;
  title?: string;
  textButton?: string;
  onClick?: () => void;
}) {
  const totalFee = fee / (1 - discount / 100);
  return (
    <div className='w-full border border-[#DEE1E6] md:flex md:flex-row md:justify-center'>
      <div className='fixed bottom-0 left-1/2 z-10 mt-2 flex w-full -translate-x-1/2 transform flex-row items-center justify-between border border-[#DEE1E6] bg-[#FFFEFF] px-4 py-3 md:static md:bottom-auto md:left-0 md:z-auto md:max-w-[800px] md:translate-x-0 md:rounded-md md:border-none'>
        <div className='flex flex-col gap-1'>
          <p className='text-[18px] font-semibold leading-6 text-[#323743] md:text-[28px] md:font-bold md:text-[#1B223C] '>
            S$ {fee.toFixed(2)}{' '}
            {discount > 0 && (
              <span className='text-[15px] font-normal text-[#FF0004] line-through md:text-[20px] md:text-[#EF0000]'>
                ${totalFee.toFixed(2)}
              </span>
            )}
          </p>
          <p className='text-[12px] font-semibold text-[#0096D8] md:text-[16px]'>
            {title}
          </p>
        </div>

        <PrimaryButton
          onClick={onClick}
          className='px-6 leading-4 text-white md:w-40'
        >
          {textButton || 'Continue'}
        </PrimaryButton>
      </div>
    </div>
  );
}
