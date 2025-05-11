'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import ArrowDownCircleIcon from '@/components/icons/ArrowDownCircle';
import FinishIcon from '@/components/icons/FinishIcon';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

export type Status = 'new' | 'completed';
export default function AddOnRow({
  title,
  icon,
  status,
  isRecommended = false,
  children,
}: {
  title: string | null;
  icon: React.ReactNode;
  status: Status;
  isRecommended?: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDeviceDetection();

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  return (
    <div
      className={clsx(
        'relative rounded-xl border-[1px] p-4 md:min-h-[212px] md:border-[1.25px] ',
        {
          'pt-6': isRecommended && status === 'new',
          '!bg-[#0C8CE94D] shadow-md md:bg-[#00ADEF21]': status === 'completed',
          'border-sky-600 md:border-sky-200': status === 'new',
        },
      )}
    >
      {isRecommended && status === 'new' && (
        <div className='absolute -top-4 right-3 rounded-full bg-sky-500 px-3 py-1'>
          <span className='text-white'>Recommended</span>
        </div>
      )}
      <div className='flex w-full items-center justify-between gap-4'>
        {status === 'new' ? (
          <div className='bg- flex items-center gap-4'>
            <div className='flex h-9 w-9 justify-center rounded-[20px] border border-[#00ADEF] bg-[#00ADEF1A]'>
              {icon}
            </div>
            <p className='font-bold'>{title}</p>
          </div>
        ) : (
          <div className='flex items-center gap-4 rounded-full'>
            <div className='flex items-center justify-center rounded-full bg-white p-[2px]'>
              <FinishIcon
                className='rounded-full bg-white text-sky-400'
                size={28}
              />
            </div>
            <p className='font-bold'>{title}</p>
          </div>
        )}
        {isMobile && (
          <ArrowDownCircleIcon
            className={clsx('cursor-pointer text-brand-blue', {
              'rotate-180': isOpen,
              'rounded-full bg-white': status === 'completed',
            })}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>
      {isOpen && <div className='pt-2'>{children}</div>}
    </div>
  );
}
