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
    <div className='fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 transform flex-row items-center justify-between rounded-t-md border border-[#DEE1E6] bg-white px-4 py-3 shadow-lg md:max-w-[800px] md:rounded-md md:border-none'>
      <div className='flex flex-col gap-2'>
        <p className='text-[18px] font-semibold leading-6 md:text-[28px] md:font-bold'>
          S$ {fee.toFixed(2)}{' '}
          {discount > 0 && (
            <span className='text-[15px] text-[#FF0004] line-through md:text-[20px] md:font-normal'>
              ${totalFee.toFixed(2)}
            </span>
          )}
        </p>
        <p className='text-[12px] font-semibold text-[#0096D8] md:text-[16px]'>
          {title}
        </p>
      </div>
      <Button
        className='rounded-xl bg-[#00ADEF] px-6 leading-4 text-white'
        onClick={onClick}
      >
        {textButton || 'Continue'}
      </Button>
    </div>
  );
}
