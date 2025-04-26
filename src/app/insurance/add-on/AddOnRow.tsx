'use client';
import clsx from 'clsx';
import { useState } from 'react';

import ArrowDownCircleIcon from '@/components/icons/ArrowDownCircle';
import FinishIcon from '@/components/icons/FinishIcon';

export type Status = 'new' | 'completed';
export default function AddOnRow({
  title,
  icon,
  status,
  isRecommended = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  status: Status;
  isRecommended?: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={clsx(
        'relative rounded-xl border-[1px] bg-gray-100 p-4 shadow-md',
        {
          'pt-6': isRecommended && status === 'new',
          'bg-sky-200': status === 'completed',
          'border-sky-600': status === 'new',
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
          <div className='flex items-center gap-4'>
            <div className='h-5 w-5'>{icon}</div>
            <p className='font-bold'>{title}</p>
          </div>
        ) : (
          <div className='flex items-center gap-4 rounded-full'>
            <div className='flex items-center justify-center rounded-full bg-white p-[2px]'>
              <FinishIcon
                className='rounded-full bg-white text-sky-400'
                size={18}
              />
            </div>
            <p className='font-bold'>{title}</p>
          </div>
        )}
        <ArrowDownCircleIcon
          className={clsx('cursor-pointer text-brand-blue', {
            'rotate-180': isOpen,
            'rounded-full bg-white': status === 'completed',
          })}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && <div className='pt-2'>{children}</div>}
    </div>
  );
}
