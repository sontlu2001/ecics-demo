'use client';

import { Select } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';

import { AddNamedDriverInfo } from '@/libs/types/quote';

import { SecondaryButton } from '@/components/ui/buttons';

import AddOnRow from './AddOnRow';
import { AddOnFormat } from './page';
import AdditionDriver from '../components/AdditionDriver';

const ADDON_CARS = ['CAR_COM_AND', 'CAR_TPFT_AND', 'CAR_TPO_AND'];

function AddOnRowDetail({
  addon,
  addonsAdded,
  setAddonsAdded,
  addonsSelected,
  setAddonsSelected,
  drivers,
  setDrivers,
}: {
  addon: AddOnFormat;
  addonsAdded: any;
  setAddonsAdded: (addonSelected: any) => void;
  addonsSelected: any;
  setAddonsSelected: (feeAdditions: any) => void;
  drivers: AddNamedDriverInfo[];
  setDrivers: (drivers: AddNamedDriverInfo[]) => void;
}) {
  const [isShowAdditionDriver, setIsShowAdditionDriver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const isAddonCars = useMemo(() => {
    return ADDON_CARS.includes(addon.code);
  }, [addon.code]);

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

  // addon: type = select && code = CAR_COM_AND
  const handleAddAddonWithDriver = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: selectedOption,
    }));
  };
  useEffect(() => {
    if (!isAddonCars) return;
    if (!drivers.length) {
      setAddonsSelected((prev: any) => ({
        ...prev,
        [addon.code]: 'NO',
      }));
      return;
    }
    // "Drivers of all age or driving experience including Young (<26 years old), Elderly (>65 years old)
    //  or Inexperienced (<2 years driving experience) drivers."
    const MIN_AGE = 26;
    const MAX_AGE = 65;
    const isValidAge = drivers.every((driver) => {
      const birthDate = new Date(driver.date_of_birth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const isBirthdayPassed =
        new Date().setFullYear(new Date().getFullYear()) >=
        birthDate.setFullYear(new Date().getFullYear());
      return (
        (isBirthdayPassed ? age : age - 1) >= MIN_AGE &&
        (isBirthdayPassed ? age : age - 1) <= MAX_AGE
      );
    });
    const isValidDrivingExperience = drivers.every(
      (driver) => driver.driving_experience >= 2,
    );
    const isMatchCondition = isValidAge && isValidDrivingExperience;
    if (!isMatchCondition) {
      setAddonsSelected((prev: any) => ({
        ...prev,
        [addon.code]: 'all_drivers',
      }));
    } else {
      setAddonsSelected((prev: any) => ({
        ...prev,
        [addon.code]: 'drivers_age_from_27_to_70',
      }));
    }
  }, [drivers, isShowAdditionDriver]);
  //end of addon: type = select && code = CAR_COM_AND

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
          <p className='text-[13px] font-semibold leading-[19px] text-[#535353]'>
            {addon.description}
          </p>
          <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />

          {addon.type === 'select' && !isAddonCars && (
            <>
              <div className='flex items-center justify-between text-[14px]'>
                <p className='font-semibold leading-[20px] text-[#525252]'>
                  Select Coverage Amount
                </p>
                <Select
                  style={{ width: 120 }}
                  className='[&_.ant-select-selector]:border-0.5 w-28 [&_.ant-select-selector]:border-[#00ADEF]'
                  options={options}
                  value={selectedOption}
                  placeholder='Select'
                  onChange={(value) => handleSelectOption(value)}
                />
              </div>
              <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
                <p className='text-[#525252]'>SGD {addon.feeSelected ?? 0}</p>
                <SecondaryButton
                  className='black h-8 w-28 rounded-md !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
                  onClick={() => handleAddAddonSelect(addon)}
                >
                  Add
                </SecondaryButton>
              </div>
            </>
          )}
          {addon.type === 'select' && isAddonCars && (
            <>
              <div className='flex items-center justify-between text-[14px]'>
                <p className='font-semibold leading-[20px] text-[#525252]'>
                  Select Coverage Amount
                </p>
                {drivers.length > 0 ? (
                  <SecondaryButton
                    className='black h-8 w-28 rounded-md '
                    onClick={() => setIsShowAdditionDriver(true)}
                  >
                    Edit Driver
                  </SecondaryButton>
                ) : (
                  <SecondaryButton
                    className='black h-8 w-28 rounded-md'
                    onClick={() => setIsShowAdditionDriver(true)}
                  >
                    Add Driver
                  </SecondaryButton>
                )}
                {isShowAdditionDriver && (
                  <AdditionDriver
                    isShowAdditionDriver={isShowAdditionDriver}
                    setIsShowAdditionDriver={setIsShowAdditionDriver}
                    setDataDrivers={setDrivers}
                    dataDrivers={drivers}
                  />
                )}
              </div>
              <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
                <p className='text-[#525252]'>SGD {addon.feeSelected ?? 0}</p>
                <SecondaryButton
                  className='black h-8 w-28 rounded-md'
                  onClick={() => handleAddAddonWithDriver(addon)}
                >
                  Add
                </SecondaryButton>
              </div>
            </>
          )}
          {addon.type === 'checkbox' && (
            <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
              <p className='text-[#525252]'>SGD {addon.feeSelected ?? 0}</p>
              <SecondaryButton
                className='black h-8 w-28 rounded-md'
                onClick={() => handleAddAddonCheckbox(addon)}
              >
                Add
              </SecondaryButton>
            </div>
          )}
        </>
      )}
      {status === 'completed' && (
        <>
          <p className='font-semibold leading-5 text-[#333333]'>
            {addon.description}
          </p>
          <div className=' my-2 border-t border-dashed border-[#00ADEFB2]' />
          <div className='flex items-center justify-between pt-2 text-[14px]'>
            <p className='font-semibold leading-[20px] text-[#333333]'>
              <span>SGD {addon.feeAdded}</span>
            </p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-red-500'
              onClick={() => handleRemoveAddon(addon)}
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
