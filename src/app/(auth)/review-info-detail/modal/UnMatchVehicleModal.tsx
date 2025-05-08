import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PrimaryButton } from '@/components/ui/buttons';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import { VehicleResponse } from '@/api/base-service/verify';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { saveToSessionStorage } from '@/libs/utils/utils';

const UnMatchVehicleModal = ({ onClose }: { onClose: () => void }) => {
  const { isMobile } = useDeviceDetection();
  const methods = useForm();
  const { setValue, watch } = methods;

  const selectedMakeId = watch('vehicle_make');

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );

  const handleSubmit = methods.handleSubmit((data) => {
    const { vehicle_make, vehicle_model } = data;

    const selectedMake = makeOptions.find(
      (make) => make.value === vehicle_make,
    );
    const selectedModel = modelOptions.find(
      (model) => model.value === vehicle_model,
    );

    if (selectedMake && selectedModel) {
      const updatedVehicles = (sessionData.vehicles || []).map(
        (vehicle: any, index: number) => {
          if (index === 0) {
            return {
              ...vehicle,
              make: { value: selectedMake.text },
              model: { value: selectedModel.text },
            };
          }
          return vehicle;
        },
      );

      const updatedSession = {
        ...sessionData,
        vehicles: updatedVehicles,
      };
      saveToSessionStorage({
        [ECICS_USER_INFO]: JSON.stringify(updatedSession),
      });
    }
    onClose();
  });

  const { data } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] =
    data?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const { data: modelOptionsData } = useGetVehicleModels(selectedMakeId || '');
  const modelOptions: DropdownOption[] =
    modelOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 ${isMobile ? 'items-end' : 'items-center'}`}
    >
      <div
        className={`flex max-h-screen w-full animate-slide-up flex-col ${isMobile ? 'rounded-t-lg' : 'rounded-lg'} bg-white shadow-lg sm:w-[490px]`}
      >
        <div className='flex h-full flex-col justify-between p-6'>
          <div className='text-center text-lg font-bold'>
            We are unable to match your vehicle with our system.
          </div>
          <div className='rounded p-2 text-center text-sm'>
            Please select your vehicle manually. Thank you.
          </div>

          <FormProvider {...methods}>
            <div>
              <div className='font-bold'>Vehicle Make</div>
              <DropdownField
                className='h-[40px]'
                name='vehicle_make'
                placeholder='Enter vehicle make'
                options={makeOptions}
                onChange={() => {
                  // Reset model when make changes
                  setValue('vehicle_model', undefined);
                }}
              />
            </div>
            <div className='mt-[8px]'>
              <div className='font-bold'>Vehicle Model</div>
              <DropdownField
                className='h-[40px]'
                name='vehicle_model'
                placeholder='Enter vehicle model'
                disabled={!selectedMakeId}
                options={modelOptions}
              />
            </div>
          </FormProvider>

          <div className='mt-[8px] text-center text-xs leading-tight'>
            If your vehicle is not listed in the drop down, please contact us
            at&nbsp;
            <a href='tel:+6562065588' className='text-blue-600 underline'>
              +6562065588
            </a>
            &nbsp;or&nbsp;
            <a
              href='mailto:customerservice@ecics.com.sg'
              className='text-blue-600 underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              customerservice@ecics.com.sg
            </a>
            &nbsp;for assistance.
          </div>

          <div className='flex justify-center gap-4 bg-white pt-4'>
            <PrimaryButton onClick={handleSubmit} className='w-full'>
              Submit
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnMatchVehicleModal;
