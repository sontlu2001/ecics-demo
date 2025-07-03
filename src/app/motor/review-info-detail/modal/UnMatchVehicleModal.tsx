import { Spin } from 'antd';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import { saveToSessionStorage } from '@/libs/utils/utils';

import { PrimaryButton } from '@/components/ui/buttons';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface UnMatchVehicleModalProps {
  onClose: () => void;
  setRefreshSession: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnMatchVehicleModal = ({
  onClose,
  setRefreshSession,
}: UnMatchVehicleModalProps) => {
  const methods = useForm();

  const partnerCode = localStorage.getItem(PARTNER_CODE);
  const promoCode = localStorage.getItem(PROMO_CODE);

  const { isMobile } = useDeviceDetection();
  const { setValue, watch } = methods;
  const selectedMakeId = watch('vehicle_make');
  const selectedModelId = watch('vehicle_model');
  const isSubmitDisabled = !selectedMakeId || !selectedModelId;

  const { mutate: savePersonalInfo } = usePostPersonalInfo();

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );

  const createPayload = (parsedData: any): SavePersonalInfoPayload => {
    const v = parsedData?.vehicle_selected || [];
    const qdlClasses = parsedData?.drivinglicence?.qdl?.classes || [];
    const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

    const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);
    const parsedSingpass = singpassDataRaw ? JSON.parse(singpassDataRaw) : {};

    return {
      key: `${uuid()}`,
      is_sending_email: false,
      promo_code: promoCode ?? '',
      partner_code: partnerCode ?? '',
      personal_info: {
        name: parsedData.name?.value || '',
        gender: parsedData.sex?.desc || '',
        marital_status: parsedData.marital?.desc || '',
        nric: parsedData.uinfin?.value || '',
        address: [
          `${parsedData.regadd?.block?.value || ''} ${parsedData.regadd?.street?.value || ''} #${parsedData.regadd?.floor?.value || ''}-${parsedData.regadd?.unit?.value || ''}, ${parsedData.regadd?.postal?.value || ''}, ${parsedData.regadd?.country?.desc || ''}`,
        ].filter(Boolean),
        post_code: parsedData.regadd?.postal?.value || '',
        date_of_birth: parsedData.dob?.value
          ? convertDateToDDMMYYYY(parsedData.dob.value)
          : '',
        driving_experience:
          qdlClasses.length > 0
            ? drivingYears >= 6
              ? '6 years and above'
              : `${drivingYears} years`
            : '1 year',
        phone: `${parsedData.mobileno?.nbr?.value || ''}`,
        email: parsedData.email?.value?.toLowerCase() || '',
      },
      vehicle_info_selected: {
        vehicle_number: v[0]?.vehicleno?.value || '',
        first_registered_year:
          extractYear(v[0]?.firstregistrationdate?.value) || '',
        vehicle_make: v[0]?.make?.value || '',
        vehicle_model: v[0]?.model?.value || '',
        engine_number: v[0]?.engineno?.value || '',
        chasis_number: v[0]?.chassisno?.value || '',
        engine_capacity: v[0]?.enginecapacity?.value || '',
        power_rate: v[0]?.powerrate?.value || '',
        year_of_manufacture: v[0]?.yearofmanufacture?.value || '',
      },
      vehicles:
        parsedData.vehicles?.map((v: any) => ({
          chasis_number: v.vehicleno?.value || '',
          vehicle_make: v.make?.value || '',
          vehicle_model: v.model?.value || '',
          first_registered_year:
            extractYear(v.firstregistrationdate?.value) || '',
        })) || [],
      data_from_singpass: parsedSingpass,
    };
  };

  const handleSubmit = methods.handleSubmit((data) => {
    const { vehicle_make, vehicle_model } = data;

    const selectedMake = makeOptions.find(
      (make) => make.value === vehicle_make,
    );
    const selectedModel = modelOptions.find(
      (model) => model.value === vehicle_model,
    );

    if (selectedMake && selectedModel) {
      if (sessionData.vehicles.length > 1) {
        const updatedVehicle = {
          ...sessionData.vehicle_selected,
          make: { value: selectedMake.text },
          model: { value: selectedModel.text },
        };

        const updatedParsed = {
          ...sessionData,
          vehicle_selected: [updatedVehicle],
        };
        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });
        onClose();
        savePersonalInfo(createPayload(updatedParsed));
      } else if (sessionData.vehicles.length === 1) {
        const updatedVehicles = sessionData.vehicles.map(
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

        const updatedParsed = {
          ...sessionData,
          vehicle_selected: [updatedVehicles[0]],
        };

        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });
        setRefreshSession((prev) => !prev);
        onClose();
        savePersonalInfo(createPayload(updatedParsed));
      }
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
                  setValue('vehicle_model', null);
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
                notFoundContent={
                  isLoadingModelOptions ? (
                    <Spin size='small' />
                  ) : (
                    'No results found'
                  )
                }
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
            <PrimaryButton
              onClick={handleSubmit}
              className='w-full'
              disabled={isSubmitDisabled}
            >
              Submit
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnMatchVehicleModal;
