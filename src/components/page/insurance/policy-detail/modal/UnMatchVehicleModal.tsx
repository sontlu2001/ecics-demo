import { Drawer, Modal, Spin } from 'antd';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton } from '@/components/ui/buttons';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { setUserInfoCar } from '@/redux/slices/userInfoCar.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

interface UnMatchVehicleModalProps {
  onClose: () => void;
  visible: boolean;
  vehicleNumber: string;
}

const UnMatchVehicleModal = ({
  onClose,
  visible,
  vehicleNumber,
}: UnMatchVehicleModalProps) => {
  const methods = useForm();

  const { isMobile } = useDeviceDetection();
  const { setValue, watch } = methods;
  const dispatch = useAppDispatch();
  const selectedMakeId = watch('vehicle_make');
  const selectedModelId = watch('vehicle_model');
  const isSubmitDisabled = !selectedMakeId || !selectedModelId;
  const carUserInfo = useAppSelector((state) => state.userInfoCar?.userInfoCar);
  const userInfoCarSingPass = carUserInfo.data_from_singpass;

  const handleSubmit = methods.handleSubmit((data) => {
    const { vehicle_make, vehicle_model } = data;

    const selectedMake = makeOptions.find(
      (make) => make.value === vehicle_make,
    );
    const selectedModel = modelOptions.find(
      (model) => model.value === vehicle_model,
    );

    if (selectedMake && selectedModel) {
      const updatedVehicles = userInfoCarSingPass.vehicles.map(
        (vehicle: any) => {
          if (vehicle.vehicleno?.value === vehicleNumber) {
            return {
              ...vehicle,
              make: { value: selectedMake.text },
              model: { value: selectedModel.text },
            };
          }
          return vehicle;
        },
      );

      const updatedVehicleSelected = updatedVehicles.find(
        (v: any) => v.vehicleno?.value === vehicleNumber,
      );

      const updatedUserInfoCar = {
        ...carUserInfo,
        vehicle_selected: updatedVehicleSelected,
        list_after_selected_vehicle: updatedVehicles,
      };

      dispatch(setUserInfoCar(updatedUserInfoCar));
      onClose();
    }
  });

  const { data } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] = useMemo(() => {
    if (!data) return [];
    return data?.map((item: any) => ({
      value: item.id,
      text: item.name,
    }));
  }, [data]);

  const { data: modelOptionsData, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(selectedMakeId || '');
  const modelOptions: DropdownOption[] = useMemo(() => {
    if (!modelOptionsData) return [];
    return modelOptionsData?.map((item: any) => ({
      value: item.id,
      text: item.name,
    }));
  }, [modelOptionsData]);

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          We're Sorry
        </p>
        <div className='flex flex-col items-center gap-6 text-center'>
          <p className='text-sm font-normal text-[#00000073]'>
            We are unable to match your vehicle model with our system.
          </p>
          <p className='text-2xl font-semibold'>{vehicleNumber}</p>
        </div>
        <FormProvider {...methods}>
          <div>
            <div className='text-base font-light'>Vehicle Make</div>
            <DropdownField
              className='h-[40px]'
              name='vehicle_make'
              placeholder='Enter vehicle make'
              options={makeOptions}
              onChange={() => {
                // Reset model when make changes
                setValue('vehicle_model', null);
              }}
            />
          </div>
          <div className='mt-[8px]'>
            <div className='text-base font-light'>Vehicle Model</div>
            <DropdownField
              className='h-[40px]'
              name='vehicle_model'
              placeholder='Enter vehicle model'
              disabled={!selectedMakeId}
              options={modelOptions}
              notFoundContent={
                isLoadingModelOptions ? (
                  <Spin size='small' />
                ) : (
                  'No results found'
                )
              }
            />
          </div>
          <div className='flex justify-center gap-4 bg-white pt-4'>
            <PrimaryButton
              onClick={handleSubmit}
              className='w-full'
              disabled={isSubmitDisabled}
            >
              Submit
            </PrimaryButton>
          </div>
        </FormProvider>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onClose}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        <div>{content}</div>
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      closable={false}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
      width={400}
    >
      <div>{content}</div>
    </Modal>
  );
};

export default UnMatchVehicleModal;
