import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import { VehicleResponse } from '@/api/base-service/verify';
import {
  ECICS_USER_INFO,
  IS_THREE_INPUT_COMPLETE,
} from '@/constants/general.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title: string;
  data: { label: string; value: string | number | null }[];
  boxClass?: string;
  setIsDisabled?: (val: boolean) => void;
  vehicleIndex?: number;
};
const isReadOnly = true;

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
  setIsDisabled,
  vehicleIndex,
}) => {
  const { isMobile } = useDeviceDetection();
  const methods = useForm();
  const { setValue, watch } = methods;
  const selectedMakeId = watch('vehicle_make');

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );
  const [vehicles, setVehicles] = useState(sessionData?.vehicles || []);

  const updateSessionStorage = (updatedVehicles: any[]) => {
    sessionStorage.setItem(
      ECICS_USER_INFO,
      JSON.stringify({ ...sessionData, vehicle_selected: updatedVehicles }),
    );
    setVehicles(updatedVehicles);
  };

  const updateVehicleOnlyInSessionStorage = (
    updatedVehicle: VehicleSingPassResponse,
    index: number,
  ) => {
    const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
    if (!sessionDataRaw) return;

    const sessionData = JSON.parse(sessionDataRaw);
    const existingVehicles: VehicleSingPassResponse[] =
      sessionData.vehicles || [];

    const updatedVehicles = [...existingVehicles];
    updatedVehicles[index] = updatedVehicle;

    sessionStorage.setItem(
      ECICS_USER_INFO,
      JSON.stringify({ ...sessionData, vehicles: updatedVehicles }),
    );
  };

  const checkInputsCompleted = (vehicle: any) => {
    const requiredFields = [
      'vehicleno',
      'firstregistrationdate',
      'make',
      'model',
      'engineno',
      'chassisno',
      'enginecapacity',
      'powerrate',
      'yearofmanufacture',
    ];
    return requiredFields.every(
      (field) => vehicle?.[field]?.value && vehicle?.[field]?.value !== null,
    );
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedVehicles = [...vehicles];
    const prevVehicle = updatedVehicles[index] || {};

    const vehicleData: Record<string, any> = {
      vehicleno: prevVehicle.vehicleno?.value || '',
      firstregistrationdate: prevVehicle.firstregistrationdate?.value
        ? new Date(prevVehicle.firstregistrationdate.value)
            .getFullYear()
            .toString()
        : '',
      make: prevVehicle.make?.value || '',
      model: prevVehicle.model?.value || '',
      engineno: prevVehicle.engineno?.value || '',
      chassisno: prevVehicle.chassisno?.value || '',
      enginecapacity: prevVehicle.enginecapacity?.value || '',
      powerrate: prevVehicle.powerrate?.value || '',
      yearofmanufacture: prevVehicle.yearofmanufacture?.value || '',
    };

    const fieldMap: Record<string, keyof typeof vehicleData> = {
      vehicle_number: 'vehicleno',
      year_of_registration: 'firstregistrationdate',
      vehicle_make: 'make',
      vehicle_model: 'model',
      engine_number: 'engineno',
      chassis_number: 'chassisno',
      engine_capacity: 'enginecapacity',
      power_rate: 'powerrate',
      year_of_manufacture: 'yearofmanufacture',
    };

    const targetField = fieldMap[field];
    if (targetField) {
      vehicleData[targetField] = value;
    }

    updatedVehicles[index] = {
      ...prevVehicle,
      vehicleno: { value: vehicleData.vehicleno },
      firstregistrationdate: {
        value: `${vehicleData.firstregistrationdate}-01-01`,
      },
      make: { value: vehicleData.make },
      model: { value: vehicleData.model },
      engineno: { value: vehicleData.engineno },
      chassisno: { value: vehicleData.chassisno },
      enginecapacity: { value: vehicleData.enginecapacity },
      powerrate: { value: vehicleData.powerrate },
      yearofmanufacture: { value: vehicleData.yearofmanufacture },
    };

    const isInputsCompleted = checkInputsCompleted(updatedVehicles[index]);
    saveToSessionStorage({
      [IS_THREE_INPUT_COMPLETE]: String(isInputsCompleted),
    });
    setIsDisabled?.(!isInputsCompleted);

    if (data.some((item) => item.value == null)) {
      const vehicleLength = sessionData.vehicle?.length ?? 0;
      if (vehicleLength === 0) {
        updateSessionStorage(updatedVehicles);
      } else if (vehicleLength === 1) {
        updateSessionStorage(updatedVehicles);
        updateVehicleOnlyInSessionStorage(updatedVehicles[index], index);
      } else {
        updateVehicleOnlyInSessionStorage(updatedVehicles[index], index);
      }
    }
  };

  //Call API
  const { data: makeOptionsData } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] =
    makeOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const { data: modelOptionsData } = useGetVehicleModels(selectedMakeId || '');
  const modelOptions: DropdownOption[] =
    modelOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const renderGrid = (vehicleIndex: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2); // Take two items at a time
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => {
            const nameKey = item.label.toLowerCase().replace(/\s+/g, '_');
            const isVehicleMake = nameKey === 'vehicle_make';
            const isVehicleModel = nameKey === 'vehicle_model';
            const isVehicleYearRegistration =
              nameKey === 'year_of_registration';

            if (
              item.value == null &&
              (isVehicleMake || isVehicleModel || isVehicleYearRegistration)
            ) {
              return (
                <FormProvider key={idx} {...methods}>
                  <div>
                    {isVehicleMake && (
                      <>
                        <div className='font-bold'>Vehicle Make</div>
                        <DropdownField
                          className='h-[40px]'
                          name='vehicle_make'
                          placeholder='Enter vehicle make'
                          options={makeOptions}
                          onChange={(value) => {
                            const selectedMake = makeOptions.find(
                              (option) => option.value === value,
                            );
                            const makeText = selectedMake
                              ? selectedMake.text
                              : '';
                            setValue('vehicle_model', undefined);
                            handleInputChange(
                              vehicleIndex,
                              'vehicle_make',
                              makeText,
                            );
                          }}
                        />
                      </>
                    )}
                    {isVehicleModel && (
                      <>
                        <div className='font-bold'>Vehicle Model</div>
                        <DropdownField
                          className='h-[40px]'
                          name='vehicle_model'
                          placeholder='Enter vehicle model'
                          disabled={!selectedMakeId}
                          options={modelOptions}
                          onChange={(value) => {
                            const selectedModel = modelOptions.find(
                              (option) => option.value === value,
                            );
                            const modelText = selectedModel
                              ? selectedModel.text
                              : '';
                            handleInputChange(
                              vehicleIndex,
                              'vehicle_model',
                              modelText,
                            );
                          }}
                        />
                      </>
                    )}
                    {isVehicleYearRegistration && (
                      <>
                        <div className='font-bold'>Year of Registration</div>
                        <DropdownField
                          className='h-[40px]'
                          name='year_of_registration'
                          placeholder='Select year'
                          options={Array.from({ length: 21 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return {
                              value: year.toString(),
                              text: year.toString(),
                            };
                          })}
                          onChange={(value) => {
                            handleInputChange(
                              vehicleIndex,
                              'year_of_registration',
                              value,
                            );
                          }}
                        />
                      </>
                    )}
                  </div>
                </FormProvider>
              );
            }

            return (
              <div key={idx}>
                <div className='text-sm font-bold'>{item.label}</div>
                <div className='text-sm'>
                  {item.value == null ? (
                    <input
                      name={nameKey}
                      type='text'
                      className='h-[30px] w-full rounded-[6px] border border-gray-300 p-2'
                      placeholder={`Enter ${item.label} info`}
                      onChange={(e) =>
                        handleInputChange(vehicleIndex, nameKey, e.target.value)
                      }
                    />
                  ) : isMobile ? (
                    item.value
                  ) : (
                    <input
                      name={nameKey}
                      defaultValue={item.value}
                      type='text'
                      className={`h-[30px] w-full rounded-[6px] border border-gray-300 bg-gray-200 p-2 ${
                        isReadOnly ? 'cursor-not-allowed' : ''
                      }`}
                      disabled={isReadOnly}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>,
      );
    }
    return chunks;
  };

  return (
    <div
      className={`${isMobile ? '' : 'rounded-md border border-gray-300 bg-gray-100 p-4'} mt-4 ${boxClass}`}
    >
      <div className='text-base font-bold underline underline-offset-4'>
        {title}
      </div>
      {renderGrid(vehicleIndex ?? 0)}
    </div>
  );
};

export default InfoSection;
