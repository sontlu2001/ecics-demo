'use client';

import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';

import { AddOnFormat } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { SecondaryButton } from '@/components/ui/buttons';
import { AddOnRadioGroupField } from '@/components/ui/form/radiofield';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';

import AddOnRow from './AddOnRow';

function AddOnRowDetail({
  addon,
  addonsAdded,
  setAddonsAdded,
  addonsSelected,
  setAddonsSelected,
  isPending,
  productType,
}: {
  addon: AddOnFormat;
  addonsAdded: any;
  setAddonsAdded: (addonSelected: any) => void;
  addonsSelected: any;
  setAddonsSelected: (feeAdditions: any) => void;
  isPending: boolean;
  productType?: ProductType;
}) {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  // addon: type = select && code != CAR_COM_AND
  useEffect(() => {
    setSelectedOption(addonsSelected?.[addon.code]);
  }, [addonsSelected?.[addon.code]]);

  const handleSelectOption = (value: any) => {
    setSelectedOption(value);
    setAddonsSelected((prev: any) => ({
      ...prev,
      [addon.code]: value,
    }));
  };
  const handleAddAddonSelect = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: selectedOption,
    }));
  };
  //end of addon: type = select && code != CAR_COM_AND

  // addon: type = checkbox
  const handleAddAddonCheckbox = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: 'YES',
    }));
  };

  const handleRemoveAddon = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: 'NO',
    }));
  };

  const status = addonsAdded?.[addon.code] === 'NO' ? 'new' : 'completed';
  const options = addon.options.map((option) => ({
    value: option.value,
    label: <span className='font-semibold text-[#1E1E1E]'>{option.label}</span>,
  }));

  if (addon.is_display === false) {
    return null;
  }

  return (
    <AddOnRow
      isRecommended={addon.is_recommended}
      title={addon.title}
      icon={addon.icon}
      status={status}
      productType={productType}
    >
      {status === 'new' && (
        <>
          {addon.description}
          <div className='my-2 border-t border-dashed border-[#F0F0F0]' />

          {addon.type === 'select' && (
            <>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-col gap-1 text-[14px]'>
                  <p className='font-semibold leading-[20px] text-[#525252]'>
                    Select Benefit
                  </p>
                  <AddOnRadioGroupField
                    options={options}
                    selectedOption={selectedOption}
                    handleSelectOption={(value) => handleSelectOption(value)}
                    isPending={isPending}
                  />
                </div>
                <div className='mt-[20px] flex items-center justify-between gap-2 text-[14px] font-semibold leading-5'>
                  <p className='text-[#525252]'>
                    {formatCurrency(addon.feeSelected ?? 0)}
                  </p>
                  <SecondaryButton
                    className='black h-8 w-28 rounded-xl !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
                    onClick={() => handleAddAddonSelect(addon)}
                    disabled={isPending}
                  >
                    Add
                  </SecondaryButton>
                </div>
              </div>
            </>
          )}
          {addon.type === 'checkbox' && (
            <div className='flex items-center justify-between gap-2 text-[14px] font-semibold leading-5 md:justify-end'>
              <p className='text-[#525252]'>
                {formatCurrency(addon.feeSelected ?? 0)}
              </p>
              <SecondaryButton
                className='black h-8 w-28 rounded-xl'
                onClick={() => handleAddAddonCheckbox(addon)}
                disabled={isPending}
              >
                Add
              </SecondaryButton>
            </div>
          )}
        </>
      )}
      {status === 'completed' && (
        <>
          {addon.description}
          <div className=' my-2 border-t border-dashed border-[#F0F0F0]' />
          <div className='flex flex-col justify-between gap-2 md:flex-row md:items-center'>
            {addon.type === 'select' && (
              <div className='text-sm font-bold text-[#525252]'>
                Selected Benefit:{' '}
                <span className='font-semibold'>
                  {addon.activeOption?.label}
                </span>
              </div>
            )}
            <div className='flex items-center justify-between gap-2 text-[14px] md:flex-1 md:justify-end'>
              <p className='font-semibold leading-[20px] text-[#525252]'>
                <span>{formatCurrency(addon.feeAdded)}</span>
              </p>
              <Button
                className='h-8 w-28 rounded-xl border border-[#FD1212] py-0 text-sm font-semibold leading-4 text-[#fd1212]'
                onClick={() => handleRemoveAddon(addon)}
                disabled={isPending}
              >
                Remove
              </Button>
            </div>
          </div>
        </>
      )}
    </AddOnRow>
  );
}

export default memo(AddOnRowDetail);
