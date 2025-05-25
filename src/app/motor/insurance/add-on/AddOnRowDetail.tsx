'use client';

import { memo, useEffect, useState } from 'react';

import { formatCurrency } from '@/libs/utils/utils';

import { SecondaryButton } from '@/components/ui/buttons';
import { AddOnDropDownField } from '@/components/ui/form/dropdownfield';

import { AddOnFormat } from './AddonDetail';
import AddOnRow from './AddOnRow';
import TruncateText from './TruncateText ';

function AddOnRowDetail({
  addon,
  addonsAdded,
  setAddonsAdded,
  addonsSelected,
  setAddonsSelected,
  isPending,
}: {
  addon: AddOnFormat;
  addonsAdded: any;
  setAddonsAdded: (addonSelected: any) => void;
  addonsSelected: any;
  setAddonsSelected: (feeAdditions: any) => void;
  isPending: boolean;
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
    >
      {status === 'new' && (
        <>
          <TruncateText text={addon.description} />
          <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />

          {addon.type === 'select' && (
            <>
              <div className='flex items-center justify-between text-[14px]'>
                <p className='font-semibold leading-[20px] text-[#525252]'>
                  Select Coverage Amount
                </p>
                <AddOnDropDownField
                  options={options}
                  selectedOption={selectedOption}
                  handleSelectOption={(value) => handleSelectOption(value)}
                  isPending={isPending}
                />
              </div>
              <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
                <p className='text-[#525252]'>
                  {formatCurrency(addon.feeSelected ?? 0)}
                </p>
                <SecondaryButton
                  className='black h-8 w-28 rounded-md !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
                  onClick={() => handleAddAddonSelect(addon)}
                  disabled={isPending}
                >
                  Add
                </SecondaryButton>
              </div>
            </>
          )}
          {addon.type === 'checkbox' && (
            <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
              <p className='text-[#525252]'>
                {formatCurrency(addon.feeSelected ?? 0)}
              </p>
              <SecondaryButton
                className='black h-8 w-28 rounded-md'
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
          <TruncateText text={addon.description} />
          <div className=' my-2 border-t border-dashed border-[#00ADEFB2]' />
          <div className='flex items-center justify-between pt-2 text-[14px]'>
            <p className='font-semibold leading-[20px] text-[#333333]'>
              <span>{formatCurrency(addon.feeAdded)}</span>
            </p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-red-500'
              onClick={() => handleRemoveAddon(addon)}
              disabled={isPending}
            >
              Remove
            </SecondaryButton>
          </div>
        </>
      )}
    </AddOnRow>
  );
}

export default memo(AddOnRowDetail);
