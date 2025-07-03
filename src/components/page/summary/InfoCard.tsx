import React, { useState } from 'react';

import { AddOnIncludedInPlan } from '@/libs/types/quote';

import { ArrowDownCircleIcon } from '@/components/icons/add-on-icons';

type Props = {
  title: string;
  data: {
    label: string;
    value:
      | string
      | {
          title: string;
          value: string;
          coverage_amount?: string;
          number_of_additional_drivers?: string;
        }[];
  }[];
  extraTitle?: string;
  extraData?: React.ReactNode;
  addOnIncludedInPlan?: AddOnIncludedInPlan[];
  drivers?: any;
};

const InfoCard = (props: Props) => {
  const { title, data, extraTitle, extraData, drivers, addOnIncludedInPlan } =
    props;

  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const specialLabels = ['Plan Details', 'Add-ons'];
  const policyPlanAddonsItems = data.filter((item) =>
    specialLabels.includes(item.label),
  );
  const normalItems = data.filter(
    (item) => !specialLabels.includes(item.label),
  );

  return (
    <div className='w-full rounded-[10px] border border-[#EDEDED] shadow-[0px_4px_20px_0px_#00000014]'>
      <div
        onClick={toggleOpen}
        className={`flex cursor-pointer select-none items-center justify-between border border-[#00ADEF] bg-[#F4FBFD] px-4 py-3 text-base font-semibold ${isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'}`}
      >
        <p>{title}</p>
        <ArrowDownCircleIcon
          size={24}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>

      {isOpen && (
        <div className='flex flex-col gap-2 px-4 py-3'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {normalItems.map((item, index) => (
              <div key={index} className='flex flex-col'>
                <p className='text-sm text-gray-600'>{item.label}</p>
                <p className='whitespace-pre-wrap break-words text-base font-semibold'>
                  {typeof item.value === 'string' && item.value}
                </p>
              </div>
            ))}
          </div>
          {policyPlanAddonsItems.length > 0 && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {policyPlanAddonsItems.map((item, index) => {
                if (item.label === 'Plan Details') {
                  return (
                    <div key={index} className='flex flex-col'>
                      <p className='text-sm text-gray-600'>{item.label}</p>
                      {typeof item.value === 'string' && (
                        <ul className='mt-1 space-y-1 text-sm font-semibold text-black'>
                          {item.value.split(/,(?!\d)/).map((val, idx) => (
                            <li
                              key={idx}
                              className='list-none before:mr-2 before:text-base before:text-black before:content-["·"]'
                            >
                              {val.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                if (item.label === 'Add-ons') {
                  return (
                    <div key={index} className='flex flex-col'>
                      <p className='text-sm text-gray-600'>{item.label}</p>
                      {Array.isArray(item.value) && item.value.length > 0 ? (
                        <div className='mt-2 flex flex-col gap-2'>
                          {item.value.map((addon, i) => (
                            <div
                              key={i}
                              className='flex flex-col overflow-hidden rounded border'
                            >
                              <div
                                className={`flex w-full items-center justify-between px-[14px] pt-[14px] ${addon.coverage_amount || addon.number_of_additional_drivers ? 'border-b pb-2' : 'pb-[14px]'}`}
                              >
                                <span className='font-semibold'>
                                  {addon.title}
                                </span>
                                <span>{addon.value}</span>
                              </div>

                              {addon.coverage_amount && (
                                <div className='px-[14px] pb-[20px] pt-2 text-sm text-gray-500'>
                                  Selected Benefit: <br />
                                  <span className='font-semibold'>
                                    {addon.coverage_amount}
                                  </span>
                                </div>
                              )}

                              {addon.number_of_additional_drivers && (
                                <div className='px-[14px] pb-[20px] pt-2 text-sm text-gray-500'>
                                  Number of Additional Drivers: <br />
                                  <span className='font-semibold'>
                                    {addon.number_of_additional_drivers}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='mt-1 font-semibold text-black'>-</p>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          )}
          {extraData && <div className='w-full'>{extraData}</div>}
          {/*{extraTitle && (*/}
          {/*    <p className='text-sm font-semibold'>*/}
          {/*      {extraTitle}*/}
          {/*      {addOnIncludedInPlan && addOnIncludedInPlan.length > 0 && (*/}
          {/*          <div className='mt-2 flex flex-col gap-2'>*/}
          {/*            {addOnIncludedInPlan.map((item, index) => (*/}
          {/*                <div*/}
          {/*                    key={index}*/}
          {/*                    className='flex flex-row items-center justify-between font-normal'*/}
          {/*                >*/}
          {/*                  <span>{item.add_on_name}</span>*/}
          {/*                  <span>INCLUDED</span>*/}
          {/*                </div>*/}
          {/*            ))}*/}
          {/*          </div>*/}
          {/*      )}*/}
          {/*    </p>*/}
          {/*)}*/}

          {/*{drivers ? (*/}
          {/*    <p className='text-sm font-semibold'>*/}
          {/*        Add Additional Named Driver(s)*/}
          {/*    </p>*/}
          {/*) : (*/}
          {/*    ''*/}
          {/*)}*/}

          {/*{extraData && (*/}
          {/*    <div className='flex flex-col gap-2'>*/}
          {/*      {extraData.map((item, index) => (*/}
          {/*          <div*/}
          {/*              key={index}*/}
          {/*              className='flex justify-between text-sm font-normal'*/}
          {/*          >*/}
          {/*            <span>{item.title}</span>*/}
          {/*            <span className='text-right'>{item.value || ''}</span>*/}
          {/*          </div>*/}
          {/*      ))}*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
