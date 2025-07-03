'use client';

import { Button } from 'antd';
import dayjs from 'dayjs';
import { memo, useState } from 'react';

import { AddNamedDriverInfo, Addon } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { PersonIcon } from '@/components/icons/add-on-icons';
import DeleteIcon from '@/components/icons/DeleteIcon';
import IconEditDriver from '@/components/icons/EditDriver';
import AddOnRow from '@/components/page/insurance/add-on/AddOnRow';

import AdditionDriver from '../components/AdditionDriver';

export const ADDON_CARS = [
  'CAR_COM_AND',
  'CAR_TPFT_AND',
  'CAR_TPO_AND',
  'CAR_FNCD_AND',
];

function AddonAdditionalDriver({
  addon,
  drivers,
  setDrivers,
  policyStartDate,
  isPending,
}: {
  addon: Addon;
  drivers: AddNamedDriverInfo[];
  setDrivers: (drivers: AddNamedDriverInfo[]) => void;
  policyStartDate: string;
  isPending: boolean;
}) {
  const [isShowAdditionDriver, setIsShowAdditionDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<AddNamedDriverInfo | null>(
    null,
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleRemoveAdditionalDriver = (driver: AddNamedDriverInfo) => {
    const updatedDrivers = drivers.filter(
      (d) => d.nric_or_fin !== driver.nric_or_fin,
    );
    setDrivers(updatedDrivers);
  };

  const status =
    drivers.every((driver) => !!driver.nric_or_fin) && !!drivers.length
      ? 'completed'
      : 'new';

  if (addon.is_display === false) {
    return null;
  }
  const baseFee = addon.options?.[0].premium_with_gst ?? 0;
  const totalFee = drivers.length ? baseFee * (drivers.length - 1) : 0;
  // addon with code: CAR_FNCD_AJE is required additional driver
  const isRequired = addon.code === 'CAR_FNCD_AND';
  return (
    <AddOnRow
      isRequired={isRequired}
      title={addon.title}
      icon={<PersonIcon className='text-brand-blue' />}
      status={status}
    >
      {addon.description}
      <div className='my-2 border-t border-dashed border-[#F0F0F0]' />
      <div className='flex flex-col gap-2'>
        <div
          className={`pb-4 ${drivers.length > 0 ? 'flex flex-row items-center justify-between' : 'flex flex-col gap-4 '}`}
        >
          <p className='text-sm font-bold'>Additional Drivers</p>
          <div className='flex  flex-col items-center justify-center gap-2'>
            {drivers.length === 0 && (
              <p className='text-sm font-normal text-[#535353]'>
                No drivers added yet
              </p>
            )}
            <Button
              className={`h-8 w-28 rounded-xl text-xs font-semibold ${drivers.length >= 3 ? 'border border-[#d9d9d9] bg-[#f5f5f5] !text-gray-300' : 'border border-[#00ADEF] bg-[#00ADEF] text-white'}`}
              onClick={() => {
                setEditingDriver(null);
                setEditingIndex(null);
                setIsShowAdditionDriver(true);
              }}
              disabled={isPending || drivers.length >= 3}
            >
              Add Driver
            </Button>
          </div>

          {isShowAdditionDriver && (
            <AdditionDriver
              isShowAdditionDriver={isShowAdditionDriver}
              setIsShowAdditionDriver={setIsShowAdditionDriver}
              setDataDrivers={(newDrivers) => {
                if (editingIndex !== null) {
                  const updated = [...drivers];
                  updated[editingIndex] = newDrivers[0];
                  setDrivers(updated);
                } else {
                  setDrivers([...drivers, newDrivers[0]]);
                }
                setEditingDriver(null);
                setEditingIndex(null);
              }}
              dataDrivers={editingIndex !== null ? [drivers[editingIndex]] : []}
              allDrivers={drivers}
              editingIndex={editingIndex}
              policyStartDate={dayjs(policyStartDate, 'DD/MM/YYYY').toDate()}
            />
          )}
        </div>

        {drivers.length > 0 && (
          <>
            {drivers.map((driver, index) => (
              <div
                className='flex w-full flex-row items-center justify-between border border-[#F0F0F0] p-2'
                key={index}
              >
                <div>
                  <p className='text-sm font-bold'>{driver.name}</p>
                  <p className='text-[11px] font-normal'>
                    {driver.nric_or_fin}
                  </p>
                </div>
                <div className='flex flex-row gap-4'>
                  <span className='text-sm font-bold text-[#000000]'>
                    {' '}
                    {index === 0 ? (
                      'FREE'
                    ) : (
                      <span>+ {formatCurrency(baseFee)}</span>
                    )}
                  </span>
                  <DeleteIcon
                    size={14}
                    onClick={() => handleRemoveAdditionalDriver(driver)}
                    className='cursor-pointer'
                  />
                  <IconEditDriver
                    className='cursor-pointer text-brand-blue'
                    size={14}
                    onClick={() => {
                      setEditingDriver(driver);
                      setEditingIndex(index);
                      setIsShowAdditionDriver(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )}
        {!isRequired && drivers.length >= 1 && (
          <div className='flex flex-row items-center justify-between'>
            <p className='text-sm font-semibold text-[#525252]'>
              {totalFee ? formatCurrency(totalFee) : 'SGD -'}
            </p>
            <Button
              className='h-8 w-28 rounded-xl border border-[#fd1212] py-0 text-sm font-semibold leading-4 text-[#fd1212]'
              disabled={isPending}
              onClick={() => setDrivers([])}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </AddOnRow>
  );
}

export default memo(AddonAdditionalDriver);
