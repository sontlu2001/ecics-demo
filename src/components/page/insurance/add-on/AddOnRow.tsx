'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { FinishIcon } from '@/components/icons/add-on-icons';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

export type Status = 'new' | 'completed';

export default function AddOnRow({
  title,
  icon,
  status,
  isRecommended = false,
  isRequired = false,
  isIncluded = false,
  productType,
  children,
}: {
  title: string | null;
  icon: React.ReactNode;
  status: Status;
  isRecommended?: boolean;
  isRequired?: boolean;
  isIncluded?: boolean;
  productType?: ProductType;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { isMobile } = useDeviceDetection();
  const isMaid = productType === ProductType.MAID;

  const _renderStatusItem = () => {
    return (
      <div>
        {isRecommended && status === 'new' && (
          <div className='absolute -top-4 right-3 rounded-full bg-sky-500 px-3 py-1 md:static md:right-auto md:top-auto'>
            <span className='text-white'>Recommended</span>
          </div>
        )}
        {isRequired && (
          <div className='absolute -top-4 right-3 rounded-full bg-[#FF9500] px-3 py-1 md:static md:right-auto md:top-auto'>
            <span className='text-white'>Required</span>
          </div>
        )}
        {isIncluded && (
          <div className='absolute -top-4 right-3 rounded-full bg-[#11CE00] px-3 py-1 md:static md:right-auto md:top-auto'>
            <span className='text-white'>Included</span>
          </div>
        )}
      </div>
    );
  };

  const _renderTitleItem = () => {
    return (
      <div className='flex items-center justify-between gap-4'>
        <div className='bg- flex items-center gap-4'>
          {!isRequired && !isIncluded ? (
            <div
              className={`flex h-9 w-9 justify-center border-[#00ADEF] ${isMaid ? 'border-[4px]' : 'rounded-[20px] border bg-[#00ADEF1A]'}`}
            >
              {icon}
            </div>
          ) : (
            <FinishIcon
              className='rounded-full bg-white text-[#11CE00]'
              size={28}
            />
          )}
          <p className='font-bold'>{title}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={clsx('relative rounded-xl border-[2px] p-4 md:min-h-[100px]', {
        'pt-6': isRecommended && status === 'new',
        'border-[#11CE00] !bg-white shadow-sm':
          status === 'completed' || isRequired || isIncluded,
        'border-gray-200': status === 'new' && !isRequired && !isIncluded,
        'border-[#17b1ee]':
          !isRequired && !isIncluded && status === 'completed',
      })}
    >
      {isMobile ? (
        <div className='w-full md:flex md:flex-row md:items-center md:justify-between'>
          {_renderStatusItem()}
          {_renderTitleItem()}
        </div>
      ) : (
        <div className='flex items-center justify-between gap-4'>
          {_renderTitleItem()}
          {_renderStatusItem()}
        </div>
      )}
      {isOpen && (
        <div className='pt-2 text-justify text-[13px] font-semibold leading-[19px] text-[#535353] transition-all'>
          {children}
        </div>
      )}
    </div>
  );
}
