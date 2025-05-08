import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
  data: { label: string; value: string | any[] }[];
  boxClass?: string;
  setIsDisabled?: (val: boolean) => void;
};
const isReadOnly = true;

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
  setIsDisabled,
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
      JSON.stringify({ ...sessionData, vehicles: updatedVehicles }),
    );
    setVehicles(updatedVehicles);
  };

  const checkInputsCompleted = (updatedVehicles: any[]) => {
    const requiredFields = [
      'make',
      'model',
      'firstregistrationdate',
      'vehicleno',
    ];
    return updatedVehicles.every((vehicle) =>
      requiredFields.every(
        (field) => vehicle[field]?.value && vehicle[field]?.value !== null,
      ),
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
      power_ate: 'powerrate',
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

    const isInputsCompleted = checkInputsCompleted(updatedVehicles);
    saveToSessionStorage({
      [IS_THREE_INPUT_COMPLETE]: String(isInputsCompleted),
    });
    setIsDisabled?.(!isInputsCompleted);

    updateSessionStorage(updatedVehicles);
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

  const renderGrid = () => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2); // Take two items at a time
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => {
            const nameKey = item.label.toLowerCase().replace(/\s+/g, '_');
            const isVehicleMake = nameKey === 'vehicle_make';
            const isVehicleModel = nameKey === 'vehicle_model';

            if (item.value == null && (isVehicleMake || isVehicleModel)) {
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
                            handleInputChange(0, 'vehicle_make', makeText);
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
                            handleInputChange(0, 'vehicle_model', modelText);
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
                        handleInputChange(0, nameKey, e.target.value)
                      }
                    />
                  ) : isMobile ? (
                    item.value
                  ) : (
                    <input
                      name={nameKey}
                      defaultValue={item.value}
                      type='text'
                      className={`h-[30px] w-full rounded-[6px] border border-gray-300 bg-gray-200 p-2 ${isReadOnly ? 'cursor-not-allowed' : ''}`}
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
      {renderGrid()}
    </div>
  );
};

export default InfoSection;
