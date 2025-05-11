'use client';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ReviewSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: { title: string; value: any }[];
  isExpanded: boolean;
  onToggle: () => void;
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  description,
  icon,
  data,
  isExpanded,
  onToggle,
  setShowModal,
  editRoute,
}) => {
  const router = useRouterWithQuery();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editRoute) {
      router.push(editRoute);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className='mt-4 flex flex-col gap-2 rounded-lg border shadow-sm'>
      <div
        className={`border ${isExpanded ? 'rounded-t-lg border-[#00ADEF] bg-[#F4FBFD]' : 'rounded-lg border-[#EDEDED]'}`}
      >
        <div className='flex w-full flex-row justify-between px-4 py-2'>
          <div className='flex w-full flex-row justify-between'>
            <div className='flex flex-row items-center gap-2'>
              <div className='flex items-center justify-center rounded-lg bg-[#00ADEF] p-2 font-bold'>
                {icon}
              </div>
              <div className='flex flex-col'>
                <p className='text-base font-semibold'>{title}</p>
                <p className='text-[14px] font-normal'>{description}</p>
              </div>
            </div>

            <div onClick={onToggle} className='cursor-pointer'>
              {isExpanded ? (
                <div className='gap flex flex-row items-center'>
                  <p className='mr-2 font-bold' onClick={handleEditClick}>
                    Edit
                  </p>
                  <ArrowUpIcon className='text-[#00ADEF]' size={15} />
                </div>
              ) : (
                <ArrowDownIcon className='text-[#00ADEF]' size={15} />
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='flex flex-col gap-2 px-4 pb-2'>
          {data.map((item, index) =>
            item.value === '' ? (
              <div key={index} className='font-semibold'>
                {item.title}
              </div>
            ) : (
              <div key={index} className='flex flex-row justify-between'>
                <p>{item.title}</p>
                <p>{item.value}</p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
export default ReviewSection;
