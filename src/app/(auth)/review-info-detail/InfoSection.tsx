import { zodResolver } from '@hookform/resolvers/zod';
import { Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodType } from 'zod';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import { parsePhoneNumber, saveToSessionStorage } from '@/libs/utils/utils';

import WarningIcon from '@/components/icons/WarningIcon';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { VehicleResponse } from '@/api/base-service/verify';
import { UnableQuote } from '@/app/insurance/basic-detail/modal/UnableQuote';
import { DRV_EXP_OPTIONS } from '@/app/insurance/basic-detail/options';
import {
  ECICS_USER_INFO,
  IS_FILL_INPUT_COMPLETE,
} from '@/constants/general.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title?: string;
  data: { label: string; value: string | number | null }[];
  boxClass?: string;
  setIsDisabled?: (val: boolean) => void;
  vehicleIndex?: number;
  validationSchema: ZodType<any>;
};
const isReadOnly = true;

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
  setIsDisabled,
  vehicleIndex,
  validationSchema,
}) => {
  const { isMobile } = useDeviceDetection();
  const methods = useForm({
    resolver: zodResolver(validationSchema),
  });
  const { setValue, watch } = methods;
  const selectedMakeId = watch('vehicle_make');
  const [showContactModal, setShowContactModal] = useState(false);
  const handleClickOK = () => {
    setShowContactModal(false);
  };

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );
  const [vehicles, setVehicles] = useState(sessionData?.vehicles || []);

  useEffect(() => {
    const ecicsData = sessionStorage.getItem(ECICS_USER_INFO);
    if (!ecicsData) return;

    const parsed = JSON.parse(ecicsData);
    const isInputsCompleted = checkInputsCompleted(parsed);

    saveToSessionStorage({
      [IS_FILL_INPUT_COMPLETE]: String(isInputsCompleted),
    });

    setIsDisabled?.(!isInputsCompleted);
  }, []);

  const updateSessionStorage = (updatedVehicles: any[]) => {
    const latestSessionRaw = sessionStorage.getItem(ECICS_USER_INFO);
    const latestSessionData = latestSessionRaw
      ? JSON.parse(latestSessionRaw)
      : {};

    saveToSessionStorage({
      [ECICS_USER_INFO]: JSON.stringify({
        ...latestSessionData,
        vehicle_selected: updatedVehicles,
      }),
    });
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

    saveToSessionStorage({
      [ECICS_USER_INFO]: JSON.stringify({
        ...sessionData,
        vehicles: updatedVehicles,
      }),
    });
  };

  const checkInputsCompleted = (data: any): boolean => {
    // Check if vehicle length is 1, use vehicles array instead of vehicle_selected
    const vehicle =
      data?.vehicles?.length === 1
        ? data?.vehicles[0]
        : data?.vehicle_selected?.[0] || {};
    const personal = data || {};

    const vehicleRequiredFields = [
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

    const isVehicleCompleted = vehicleRequiredFields.every((field) => {
      const value = vehicle?.[field]?.value;
      const isValid =
        value !== undefined && value !== null && String(value).trim() !== '';
      if (!isValid) {
        console.warn(`Invalid or missing value for field "${field}":`, value);
      }
      return isValid;
    });

    const isEmailValid = !!personal?.email?.value;
    const isMobileValid =
      !!personal?.mobileno?.prefix?.value?.trim() &&
      !!personal?.mobileno?.areacode?.value?.trim() &&
      !!personal?.mobileno?.nbr?.value?.trim();

    const hasValidDrivingLicence = Array.isArray(
      personal?.drivinglicence?.qdl?.classes,
    )
      ? personal.drivinglicence.qdl.classes.some((item: any) =>
          item?.issuedate?.value?.trim?.(),
        )
      : false;

    const allCompleted =
      isVehicleCompleted &&
      isEmailValid &&
      isMobileValid &&
      hasValidDrivingLicence;

    if (allCompleted === true) {
      setIsDisabled?.(false);
    }

    return allCompleted;
  };

  const handleInputChangeEmailPhone = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.trim();
    const inputName = e.target.name.toLowerCase();
    const ecicsData = sessionStorage.getItem(ECICS_USER_INFO);
    if (!ecicsData) return;

    const parsed = JSON.parse(ecicsData);
    const today = new Date().toISOString().split('T')[0];

    if (inputName === 'email_address') {
      if (!parsed.email) {
        parsed.email = {};
      }
      parsed.email.value = value;
      parsed.email.lastupdated = today;
    }

    if (inputName === 'phone_number') {
      const { prefix, areaCode, nbr } = parsePhoneNumber(value);

      parsed.mobileno = {
        prefix: { value: prefix },
        areacode: { value: areaCode },
        nbr: { value: nbr },
        lastupdated: today,
      };
    }
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(parsed) });

    // Check if inputs are completed
    const isInputsCompleted = checkInputsCompleted(parsed);
    saveToSessionStorage({
      [IS_FILL_INPUT_COMPLETE]: String(isInputsCompleted),
    });
  };

  const handlePersonalInfoInputChange = (
    inputName: string,
    value: any,
    setShowContactModal?: (show: boolean) => void,
  ) => {
    if (inputName === 'qualified_driving_license') {
      const ecicsData = sessionStorage.getItem(ECICS_USER_INFO);
      if (!ecicsData) return;

      const parsed = JSON.parse(ecicsData);
      const today = new Date();

      if (value === 0 && setShowContactModal) {
        setShowContactModal(true);
        // Delete data if it was there before
        if (
          parsed.drivinglicence &&
          parsed.drivinglicence.qdl &&
          parsed.drivinglicence.qdl.classes &&
          parsed.drivinglicence.qdl.classes.length > 0
        ) {
          delete parsed.drivinglicence.qdl.classes[0].class;
          delete parsed.drivinglicence.qdl.classes[0].issuedate;
        }
        saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(parsed) });
        return;
      }

      if (typeof value === 'number' && value > 0) {
        const issuedDate = new Date(today);
        issuedDate.setFullYear(today.getFullYear() - value);
        const formattedDate = issuedDate.toISOString().split('T')[0];

        if (
          parsed.drivinglicence &&
          parsed.drivinglicence.qdl &&
          parsed.drivinglicence.qdl.classes &&
          parsed.drivinglicence.qdl.classes.length > 0
        ) {
          parsed.drivinglicence.qdl.classes[0].class = { value: '3A' };
          parsed.drivinglicence.qdl.classes[0].issuedate = {
            value: formattedDate,
          };
        } else {
          parsed.drivinglicence = {
            ...parsed.drivinglicence,
            qdl: {
              classes: [
                {
                  class: { value: '3A' },
                  issuedate: { value: formattedDate },
                },
              ],
            },
          };
        }

        parsed.drivinglicence.lastupdated = formattedDate;
        saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(parsed) });
      }

      // Check if inputs are completed
      const isInputsCompleted = checkInputsCompleted(parsed);
      saveToSessionStorage({
        [IS_FILL_INPUT_COMPLETE]: String(isInputsCompleted),
      });
    }
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedVehicles = [...vehicles];
    const prevVehicle = updatedVehicles[index] || {};

    const fieldMap: Record<string, string> = {
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

    const targetKey = fieldMap[field];
    if (!targetKey) return;

    // Create new object
    const newVehicle = {
      vehicleno: {
        value:
          targetKey === 'vehicleno'
            ? value
            : prevVehicle.vehicleno?.value || '',
      },
      firstregistrationdate: {
        value:
          targetKey === 'firstregistrationdate'
            ? `${value}-01-01`
            : prevVehicle.firstregistrationdate?.value || '',
      },
      make: {
        value: targetKey === 'make' ? value : prevVehicle.make?.value || '',
      },
      model: {
        value: targetKey === 'model' ? value : prevVehicle.model?.value || '',
      },
      engineno: {
        value:
          targetKey === 'engineno' ? value : prevVehicle.engineno?.value || '',
      },
      chassisno: {
        value:
          targetKey === 'chassisno'
            ? value
            : prevVehicle.chassisno?.value || '',
      },
      enginecapacity: {
        value:
          targetKey === 'enginecapacity'
            ? value
            : prevVehicle.enginecapacity?.value || '',
      },
      powerrate: {
        value:
          targetKey === 'powerrate'
            ? value
            : prevVehicle.powerrate?.value || '',
      },
      yearofmanufacture: {
        value:
          targetKey === 'yearofmanufacture'
            ? value
            : prevVehicle.yearofmanufacture?.value || '',
      },
    };

    updatedVehicles[index] = newVehicle;

    const vehicleLength = sessionData.vehicles?.length ?? 0;

    if (data.some((item) => item.value == null)) {
      if (vehicleLength === 0) {
        updateSessionStorage(updatedVehicles);
      } else if (vehicleLength === 1) {
        updateSessionStorage(updatedVehicles);
        updateVehicleOnlyInSessionStorage(newVehicle, index);
      } else {
        updateVehicleOnlyInSessionStorage(newVehicle, index);
      }
    }

    const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
    const ecicsData = sessionDataRaw ? JSON.parse(sessionDataRaw) : {};
    const updatedData =
      vehicleLength === 1
        ? { ...ecicsData, vehicles: updatedVehicles }
        : {
            ...ecicsData,
            vehicle_selected: [
              {
                ...ecicsData.vehicle_selected?.[0],
                [field]: { value },
              },
            ],
          };

    // Check if entered is complete
    const isInputsCompleted = checkInputsCompleted(updatedData);
    saveToSessionStorage({
      [IS_FILL_INPUT_COMPLETE]: String(isInputsCompleted),
    });
  };

  //Call API
  const { data: makeOptionsData } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] =
    makeOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const { data: modelOptionsData, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(selectedMakeId || '');
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
        <div
          key={i}
          className={
            title === 'Enter a valid Email and Contact Number' && isMobile
              ? 'mt-[4px]'
              : 'mt-2 grid grid-cols-2 gap-4'
          }
        >
          {chunk.map((item, idx) => {
            const nameKey = item.label.toLowerCase().replace(/\s+/g, '_');
            const isEmailAddress = nameKey === 'email_address';
            const isPhoneNumber = nameKey === 'phone_number';
            const isVehicleMake = nameKey === 'vehicle_make';
            const isVehicleModel = nameKey === 'vehicle_model';
            const isVehicleYearRegistration =
              nameKey === 'year_of_registration';
            const isDrivingLicence = nameKey === 'qualified_driving_license';

            if (
              item.value == null &&
              (isEmailAddress ||
                isPhoneNumber ||
                isVehicleMake ||
                isVehicleModel ||
                isVehicleYearRegistration ||
                isDrivingLicence)
            ) {
              return (
                <div key={idx}>
                  <div>
                    {isEmailAddress && (
                      <>
                        <div className='text-sm font-bold'>Email Address</div>
                        <InputField
                          name={nameKey}
                          type='text'
                          className='h-[30px] w-full rounded-[6px] border border-gray-300 p-2'
                          placeholder={`Enter ${item.label} info`}
                          onChange={handleInputChangeEmailPhone}
                        />
                      </>
                    )}
                    {isPhoneNumber && (
                      <>
                        <div className='text-sm font-bold'>Phone Number</div>
                        <InputField
                          name={nameKey}
                          type='text'
                          className='h-[30px] w-full rounded-[6px] border border-gray-300 p-2'
                          placeholder={`Enter ${item.label} info, e.g. +65 81234567`}
                          onChange={handleInputChangeEmailPhone}
                        />
                      </>
                    )}
                    {isVehicleMake && (
                      <>
                        <div className='text-sm font-bold'>Vehicle Make</div>
                        <DropdownField
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
                          showSearch
                        />
                      </>
                    )}
                    {isVehicleModel && (
                      <>
                        <div className='text-sm font-bold'>Vehicle Model</div>
                        <DropdownField
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
                          notFoundContent={
                            isLoadingModelOptions ? (
                              <Spin size='small' />
                            ) : (
                              'No results found'
                            )
                          }
                          showSearch
                        />
                      </>
                    )}
                    {isVehicleYearRegistration && (
                      <>
                        <div className='text-sm font-bold'>
                          Year of Registration
                        </div>
                        <DropdownField
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
                    {isDrivingLicence && (
                      <>
                        <div className='text-sm font-bold'>
                          Driving Experience
                        </div>
                        <DropdownField
                          name='qualified_driving_license'
                          placeholder='Select driving experience year'
                          options={DRV_EXP_OPTIONS}
                          onChange={(value) =>
                            handlePersonalInfoInputChange(
                              'qualified_driving_license',
                              value,
                              setShowContactModal,
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={idx}>
                <div className='text-sm font-bold'>{item.label}</div>
                <div className='text-sm'>
                  {item.value == null ? (
                    <InputField
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
      <div className='flex items-center justify-between'>
        {!(title === 'Enter a valid Email and Contact Number' && isMobile) && (
          <span
            className={`text-base font-bold ${
              title === 'Enter a valid Email and Contact Number' && !isMobile
                ? ''
                : 'underline underline-offset-4'
            }`}
          >
            {title}
          </span>
        )}
        {title === 'Enter a valid Email and Contact Number' && !isMobile && (
          <Tooltip title='We use this information to verify your identity and pre-fill your application with accurate government-verified data. This helps ensure a faster, more secure, and seamless submission process.'>
            <span className='flex cursor-pointer items-center font-bold'>
              <WarningIcon size={14} />
              <span className='ml-1 text-[10px]'>Why do we need this?</span>
            </span>
          </Tooltip>
        )}
      </div>
      {renderGrid(vehicleIndex ?? 0)}
      {showContactModal && (
        <UnableQuote onClick={handleClickOK} visible={showContactModal} />
      )}
    </div>
  );
};

export default InfoSection;
