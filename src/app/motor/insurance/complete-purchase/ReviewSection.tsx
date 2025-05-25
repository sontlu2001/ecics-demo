'use client';

import React, { useState } from 'react';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';

import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { useAppSelector } from '@/redux/store';

import ModalImportant from './ModalImportant';

interface ReviewSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: { title: string; value: any }[];
  isExpanded: boolean;
  onToggle: () => void;
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
  isPendingSave?: boolean;
  isPendingPay?: boolean;
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
  isPendingSave,
  isPendingPay,
}) => {
  const router = useRouterWithQuery();
  const isFinalized = useAppSelector(
    (state) => state.quote?.quote?.is_finalized,
  );
  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);

  const handleEditClick = () => {
    if (editRoute === ROUTES.INSURANCE.BASIC_DETAIL) {
      setIsShowPopupImportant(true);
    } else {
      handleRedirect();
    }
  };

  const handleRedirect = () => {
    if (editRoute) {
      router.push(editRoute);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className='mt-4 flex w-full flex-col gap-2 rounded-lg border shadow-sm'>
      <div className='w-full min-w-[335px] '>
        <div
          className={`border px-2 ${isExpanded ? 'w-full rounded-t-lg border-[#00ADEF] bg-[#F4FBFD]' : 'rounded-lg border-[#EDEDED]'}`}
        >
          <div className='flex w-full flex-row  justify-between py-2'>
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                {!isExpanded && (
                  <div className='flex items-center justify-center rounded-lg bg-[#00ADEF] p-2 font-bold'>
                    {icon}
                  </div>
                )}
                <div className='flex flex-col pl-2'>
                  <p className='text-base font-semibold'>{title}</p>
                  {!isExpanded && (
                    <p className='text-[14px] font-normal'>{description}</p>
                  )}
                </div>
              </div>
              <div onClick={onToggle} className='cursor-pointer'>
                {isExpanded ? (
                  <div className='gap flex flex-row items-center'>
                    {!isFinalized && (
                      <p
                        className='mr-2 font-bold'
                        onClick={() => {
                          if (!isPendingSave && !isPendingPay) {
                            handleEditClick();
                          }
                        }}
                      >
                        Edit
                      </p>
                    )}
                    <ArrowUpIcon className='text-[#00ADEF]' size={15} />
                  </div>
                ) : (
                  <ArrowDownIcon className='text-[#00ADEF]' size={15} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='flex min-h-1 flex-col gap-2 px-4 pb-2'>
          {data.map((item, index) =>
            item.value === '' ? (
              <div key={index} className='font-semibold'>
                {item.title}
              </div>
            ) : (
              <div key={index} className='flex flex-row justify-between'>
                <p className='flex-[3]'>{item.title}</p>
                <p className='flex-[2] text-end'>{item.value}</p>
              </div>
            ),
          )}
        </div>
      )}

      <ModalImportant
        isShowPopupImportant={isShowPopupImportant}
        handleRedirect={handleRedirect}
        setIsShowPopupImportant={setIsShowPopupImportant}
      />
    </div>
  );
};

export default ReviewSection;
