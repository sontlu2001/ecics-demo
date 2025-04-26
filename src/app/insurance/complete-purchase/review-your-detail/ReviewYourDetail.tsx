'use client';

import { useState } from 'react';

import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import MainDriverDetailsIcon from '@/components/icons/MainDriverDetailsIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import VehicleDetailsIcon from '@/components/icons/VehicleDetailsIcon';

const sections = [
  {
    key: 'basic',
    title: 'Basic Details',
    icon: BasicDetailsIcon,
    subtitle: 'Policy Period',
    details: (
      <>
        <div className='flex justify-between'>
          <div>Policy Start Date:</div>
          <div>15/12/2024</div>
        </div>
        <div className='flex justify-between'>
          <div>Policy End Date</div>
          <div>15/12/2025</div>
        </div>
        <div className='flex justify-between'>
          <div>No Claim Discount</div>
          <div>50%</div>
        </div>
        <div className='flex justify-between'>
          <div>Number of claims in last 3 years</div>
          <div>0</div>
        </div>
        <div className='flex justify-between'>
          <div>Vehicle financed by</div>
          <div>DBS Bank</div>
        </div>
      </>
    ),
  },
  {
    key: 'vehicle',
    title: 'Vehicle Details',
    icon: VehicleDetailsIcon,
    subtitle: 'BMW i5 2.2 ST1234B',
    details: <div>Plate No: ST1234B | Model: BMW i5 2.2</div>,
  },
  {
    key: 'policy',
    title: 'Policy Plan',
    icon: PolicyPlanIcon,
    subtitle: 'Comprehensive Plan',
    details: <div>Comprehensive Plan</div>,
  },
  {
    key: 'add_ons_selected',
    title: 'Add Ons Selected',
    icon: AddOnsSelectedIcon,
    subtitle: 'Additional Named Driver',
    details: <div>Additional Named Driver</div>,
  },
  {
    key: 'additional_driver',
    title: 'Additional Driver Details',
    icon: AdditionalDriverDetailsIcon,
    subtitle: 'Steve Smith',
    details: <div>Steve Smith</div>,
  },
  {
    key: 'main_driver',
    title: 'Main Driver Details',
    icon: MainDriverDetailsIcon,
    subtitle: 'John Doe',
    details: <div>John Doe</div>,
  },
];

const ReviewYourDetail = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(Object.fromEntries(sections.map((s) => [s.key, false])));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className='relative flex-grow p-6'>
      <div className='mb-2 text-lg font-bold'>Review your details</div>

      {sections.map(({ key, title, icon: Icon, subtitle, details }) => {
        const isExpanded = expandedSections[key];
        return (
          <div key={key} className='mt-4'>
            {!isExpanded ? (
              <div
                className='relative flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
                onClick={() => toggleSection(key)}
              >
                <div className='flex items-center self-center'>
                  <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
                    <Icon size={24} className='text-white' />
                  </div>
                </div>
                <div className='ml-2 flex flex-grow flex-col justify-center'>
                  <div className='flex items-center justify-between'>
                    <div className='text-base font-semibold text-black'>
                      {title}
                    </div>
                    <ArrowDownIcon
                      size={12}
                      className='mr-[10px] text-brand-blue'
                    />
                  </div>
                  <div className='text-sm'>{subtitle}</div>
                </div>
              </div>
            ) : (
              <div className='overflow-hidden rounded-[8px] shadow-lg'>
                <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
                  <div className='text-base font-semibold'>{title}</div>
                  <div className='flex items-center gap-3'>
                    <button className='text-sm font-semibold'>Edit</button>
                    <ArrowUpIcon
                      size={12}
                      className='cursor-pointer text-brand-blue'
                      onClick={() => toggleSection(key)}
                    />
                  </div>
                </div>
                <div className='space-y-2 rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
                  {details}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewYourDetail;
