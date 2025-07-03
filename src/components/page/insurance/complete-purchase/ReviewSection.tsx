'use client';

import React, { useState } from 'react';

import { convertDateToDDMMYYYY } from '@/libs/utils/date-utils';
import { capitalizeWords } from '@/libs/utils/utils';

import ModalImportant from '@/components/page/insurance/complete-purchase/ModalImportant';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { useAppSelector } from '@/redux/store';

interface ReviewSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  data: {
    title: string;
    value: any;
    coverage_amount?: string;
    number_of_additional_drivers?: string;
  }[];
  isExpanded?: boolean;
  onToggle?: () => void;
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
  isPendingSave?: boolean;
  isPendingPay?: boolean;
  sectionKey?: string;
  productType?: ProductType;
  isSingPassFlow?: boolean;
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
  sectionKey,
  productType,
  isSingPassFlow,
}) => {
  const router = useRouterWithQuery();
  const { isMobile } = useDeviceDetection();

  const isMaid = productType === ProductType.MAID;
  const isFinalized = useAppSelector((state) =>
    isMaid
      ? state.maidQuote?.maidQuote?.is_finalized
      : state.quote?.quote?.is_finalized,
  );

  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);

  const handleEditClick = () => {
    const isBasicDetailRoute = isMaid
      ? editRoute === ROUTES.INSURANCE_MAID.BASIC_DETAIL
      : editRoute === ROUTES.INSURANCE.BASIC_DETAIL;

    if (isBasicDetailRoute) {
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
    <div className='mt-4 flex w-full flex-col rounded-lg shadow-sm'>
      <div className='w-full min-w-[335px] '>
        <div
          className={`px-2 ${isExpanded ? 'w-full rounded-t-lg bg-[#F4FBFD]' : 'rounded-lg border-[#EDEDED]'}`}
        >
          <div className='flex w-full flex-row justify-between py-2'>
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                {!isExpanded && (
                  <div className='flex items-center justify-center rounded-lg bg-[#00ADEF] p-2 font-bold'>
                    {icon}
                  </div>
                )}
                <div className='flex flex-col pl-2'>
                  <p className='text-lg font-semibold'>{title}</p>
                  {!isExpanded && (
                    <p className='text-[14px] font-normal'>{description}</p>
                  )}
                </div>
              </div>
              <div onClick={onToggle} className='cursor-pointer'>
                {isExpanded &&
                  !isFinalized &&
                  !(
                    isSingPassFlow &&
                    [
                      'Driving Licenses',
                      'Vehicle Details',
                      'Personal Info (Main Driver)',
                      'Employer Details',
                    ].includes(title)
                  ) && (
                    <div className='gap flex flex-row items-center'>
                      <p
                        className={`mr-2 font-bold ${
                          isPendingSave || isPendingPay
                            ? 'cursor-not-allowed text-gray-400'
                            : 'cursor-pointer text-[#00ADEF]'
                        }`}
                        onClick={() => {
                          if (!isPendingSave && !isPendingPay) {
                            handleEditClick();
                          }
                        }}
                      >
                        Edit
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='flex min-h-1 flex-col gap-2 rounded-bl-[6px] rounded-br-[6px] border border-t-0 px-4 pb-2 pt-[20px]'>
          {sectionKey === 'driving_licenses' ? (
            <div
              className={`grid gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
                isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'
              }`}
            >
              {data.map((item, index) => {
                const {
                  class: className,
                  issuedDate,
                  expiryDate,
                  validity,
                } = item.value;
                return (
                  <div
                    key={index}
                    className='relative rounded-[6px] border-[1px] border-gray-300 bg-white px-4 py-2 shadow-sm'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='mb-2 text-base font-bold'>
                        Class {className}
                      </div>
                      <div
                        className={`mb-2 rounded-[10px] px-[14px] py-[4px] text-sm font-semibold text-white ${
                          validity === 'VALID'
                            ? 'bg-[#34C759]'
                            : validity === 'EXPIRED'
                              ? 'bg-[#F9B776]'
                              : validity === 'INVALID'
                                ? 'bg-[#FF3B30]'
                                : ''
                        }`}
                      >
                        {capitalizeWords(validity)}
                      </div>
                    </div>
                    <div className='absolute left-0 right-0 h-[1px] bg-gray-200'></div>
                    <div className='mt-4 grid grid-cols-2 gap-x-5 text-sm'>
                      <div>
                        <div className='text-sm font-light'>Issued Date</div>
                        <div className='text-base font-semibold'>
                          {convertDateToDDMMYYYY(issuedDate) || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm font-light'>Expiry Date</div>
                        <div className='text-base font-semibold'>
                          {convertDateToDDMMYYYY(expiryDate) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 text-start md:gap-4 ${
                sectionKey === 'addons' || sectionKey === 'policy_plan'
                  ? ''
                  : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col text-sm ${
                    sectionKey === 'addons' ? 'rounded border p-[14px]' : 'p-2'
                  }`}
                >
                  {sectionKey === 'addons' ? (
                    <>
                      <div
                        className={`-mx-[14px] flex flex-row justify-between px-[14px] ${
                          item.coverage_amount ||
                          item.number_of_additional_drivers
                            ? 'border-b pb-2'
                            : ''
                        }`}
                      >
                        <div className='font-semibold'>{item.title}</div>
                        <div>{item.value || '-'}</div>
                      </div>
                      {item.coverage_amount && (
                        <div className='mt-2 pt-2'>
                          <div className='text-gray-500'>Selected Benefit</div>
                          <div className='font-semibold'>
                            {item.coverage_amount}
                          </div>
                        </div>
                      )}
                      {item.number_of_additional_drivers && (
                        <div className='mt-2 pt-2'>
                          <div className='text-gray-500'>
                            Number of Additional Drivers
                          </div>
                          <div className='font-semibold'>
                            {item.number_of_additional_drivers}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>{item.title}</div>
                      <div className='whitespace-pre-wrap break-words font-semibold'>
                        {item.value ? (
                          sectionKey === 'policy_plan' &&
                          item.title === 'Plan Details' ? (
                            <ul className='list-inside list-disc'>
                              {(item.value as string)
                                .split(/,(?!\d)/)
                                .map((part: string, idx: number) => (
                                  <li key={idx}>{part.trim()}</li>
                                ))}
                            </ul>
                          ) : (
                            item.value
                          )
                        ) : (
                          '-'
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
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
