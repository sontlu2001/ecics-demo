'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { SavePersonalInfoPayload, Vehicle } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import {
  calculateAge,
  capitalizeWords,
  saveToSessionStorage,
} from '@/libs/utils/utils';

import WarningIcon from '@/components/icons/WarningIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import UnMatchVehicleModal from '@/app/(auth)/review-info-detail/modal/UnMatchVehicleModal';
import { UnableQuote } from '@/app/insurance/basic-detail/modal/UnableQuote';
import { VehicleSelectionModal } from '@/app/insurance/components/VehicleSelection';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { usePostCheckVehicle } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import InfoSection from './InfoSection';

const reviewInfoSchema = z.object({
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phone: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  personal: z.object({
    nameAsPerNric: z.string().min(1, 'Required'),
    nric: z.string().min(1, 'Required'),
    gender: z.string().min(1, 'Required'),
    maritalStatus: z.string().min(1, 'Required'),
    dateOfBirth: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
  }),
  vehicle: z.object({
    vehicleMake: z.string().min(1, 'Required'),
    yearOfRegistration: z.string().min(4, 'Enter a valid year'),
    chassisNumber: z.string().min(1, 'Required'),
  }),
});

type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

interface CommonInfo {
  email: string;
  phone: string;
  personal: Array<{ label: string; value: string }>;
  vehicle: Array<{ label: string; value: string }>;
}

const ReviewInfoDetail = () => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [commonInfo, setCommonInfo] = useState<CommonInfo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showChooseVehicleModal, setShowChooseVehicleModal] = useState(false);
  const [showUnMatchModal, setShowUnMatchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [refreshSession, setRefreshSession] = useState(false);

  const handleGoBack = () => {
    setShowContactModal(false);
    router.push(ROUTES.AUTH.LOGIN);
  };

  const { mutate: savePersonalInfo } = usePostPersonalInfo();
  const { mutate: postCheckVehicle, isSuccess } = usePostCheckVehicle(() => {
    setShowUnMatchModal(true);
  });

  useEffect(() => {
    if (isSuccess) {
      const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
      if (!sessionDataRaw) return;

      const parsed = JSON.parse(sessionDataRaw);
      if (Array.isArray(parsed.vehicles) && parsed.vehicles.length === 1) {
        const vehicleSelected = [...parsed.vehicles];
        const updatedParsed = {
          ...parsed,
          vehicle_selected: vehicleSelected,
        };
        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });

        const v = updatedParsed.vehicle_selected[0] || {};

        const vehicle_info_selected = {
          chasis_number: v.vehicleno?.value || '',
          vehicle_make: v.make?.value || '',
          vehicle_model: v.model?.value || '',
          first_registered_year:
            extractYear(v.firstregistrationdate?.value) || '',
        };

        const qdlClasses = updatedParsed?.drivinglicence?.qdl?.classes || [];

        const payload: SavePersonalInfoPayload = {
          key: `${uuid()}`,
          is_sending_email: false,
          personal_info: {
            name: updatedParsed.name?.value || '',
            gender: updatedParsed.sex?.desc || '',
            marital_status: updatedParsed.marital?.desc || '',
            nric: updatedParsed.uinfin?.value || '',
            address: [
              `${updatedParsed.regadd?.block?.value || ''} ${updatedParsed.regadd?.street?.value || ''} #${updatedParsed.regadd?.floor?.value || ''}-${updatedParsed.regadd?.unit?.value || ''}, ${updatedParsed.regadd?.postal?.value || ''}, ${updatedParsed.regadd?.country?.desc || ''}`,
            ].filter(Boolean),
            date_of_birth: updatedParsed.dob?.value
              ? convertDateToDDMMYYYY(updatedParsed.dob.value)
              : '',
            year_of_registration: updatedParsed.year_of_registration || '',
            driving_experience:
              qdlClasses.length > 0
                ? `${calculateDrivingExperienceFromLicences(qdlClasses)} years`
                : '1 year',
            phone: `${updatedParsed.mobileno?.nbr?.value || ''}`,
            email: updatedParsed.email?.value || '',
          },
          vehicle_info_selected,
          vehicles:
            updatedParsed.vehicles?.map((v: any) => ({
              chasis_number: v.vehicleno?.value || '',
              vehicle_make: v.make?.value || '',
              vehicle_model: v.model?.value || '',
              first_registered_year:
                extractYear(v.firstregistrationdate?.value) || '',
            })) || [],
        };

        savePersonalInfo(payload);
      }
    }
  }, [isSuccess]);

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (stored) {
      const parsed = JSON.parse(stored);

      const transformed = {
        email: parsed.email?.value || '',
        phone: `${parsed.mobileno?.prefix?.value || ''}${parsed.mobileno?.areacode?.value || ''} ${parsed.mobileno?.nbr?.value || ''}`,
        personal: [
          {
            label: 'Name as per NRIC',
            value: capitalizeWords(parsed.name?.value) || '',
          },
          {
            label: 'NRIC',
            value: parsed.uinfin?.value || '',
          },
          {
            label: 'Gender',
            value: capitalizeWords(parsed.sex?.desc) || '',
          },
          {
            label: 'Marital Status',
            value: capitalizeWords(parsed.marital?.desc) || '',
          },
          {
            label: 'Date of Birth',
            value: parsed.dob?.value
              ? new Date(parsed.dob.value).toLocaleDateString('en-GB')
              : '',
          },
          {
            label: 'Address',
            value: [
              capitalizeWords(parsed.regadd?.block?.value || ''),
              capitalizeWords(parsed.regadd?.street?.value || ''),
              parsed.regadd?.floor?.value || parsed.regadd?.unit?.value
                ? `#${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}`
                : '',
              capitalizeWords(parsed.regadd?.building?.value || ''),
              capitalizeWords(parsed.regadd?.country?.desc || 'Singapore'),
              parsed.regadd?.postal?.value,
            ]
              .filter(Boolean)
              .join(' ')
              .trim(),
          },
          {
            label: 'Qualified Driving License',
            value: parsed.drivinglicence?.qdl?.classes?.length
              ? parsed.drivinglicence.qdl.classes
                  .map((c: any) => {
                    const cls = c.class?.value || '';
                    const issued = c.issuedate?.value
                      ? new Date(c.issuedate.value)
                          .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                          .replace(/ /g, ' ')
                      : '';
                    return `${cls} / ${issued}`;
                  })
                  .join(', ')
              : '',
          },
        ],
        vehicle:
          parsed.vehicles?.length > 0
            ? parsed.vehicles
                .map((v: any) => [
                  {
                    label: 'Vehicle Number',
                    value: v.vehicleno?.value || null,
                  },
                  {
                    label: 'Year of Registration',
                    value: extractYear(v.firstregistrationdate?.value) || null,
                  },
                  {
                    label: 'Vehicle Make',
                    value:
                      capitalizeWords(`${v.make?.value || ''} `).trim() || null,
                  },
                  {
                    label: 'Vehicle Model',
                    value:
                      capitalizeWords(`${v.model?.value || ''}`).trim() || null,
                  },
                  {
                    label: 'Engine Number',
                    value: v.engineno?.value || null,
                  },
                  {
                    label: 'Chassis Number',
                    value: v.chassisno?.value || null,
                  },
                  {
                    label: 'Engine Capacity',
                    value: v.enginecapacity?.value || null,
                  },
                  {
                    label: 'Power Rate',
                    value: v.powerrate?.value || null,
                  },
                  {
                    label: 'Year of Manufacture',
                    value: v.yearofmanufacture?.value || null,
                  },
                ])
                .flat() || []
            : [
                { label: 'Vehicle Number', value: null },
                { label: 'Year of Registration', value: null },
                { label: 'Vehicle Make', value: null },
                { label: 'Vehicle Model', value: null },
                { label: 'Engine Number', value: null },
                { label: 'Chassis Number', value: null },
                { label: 'Engine Capacity', value: null },
                { label: 'Power Rate', value: null },
                { label: 'Year of Manufacture', value: null },
              ],
      };
      setCommonInfo(transformed);

      // Check if any vehicle field has "null"
      const hasInvalidVehicle = transformed.vehicle.some(
        (item: any) => item.value === null,
      );
      if (hasInvalidVehicle) {
        setIsDisabled(true);
      }

      methods.reset({
        email: transformed.email,
        phone: transformed.phone,
      });

      if (parsed.vehicles?.length === 1) {
        const vehicle = parsed.vehicles[0];
        const make = vehicle?.make?.value?.trim();
        const model = vehicle?.model?.value?.trim();
        if (!make || !model) {
          setShowUnMatchModal(true);
        }

        const registrationYearStr = extractYear(
          vehicle.firstregistrationdate?.value,
        );
        const registrationYear = Number(registrationYearStr);
        const currentYear = new Date().getFullYear();
        if (!registrationYear || registrationYear < currentYear - 20) {
          setShowContactModal(true);
        }
      }
    }
  }, [methods, refreshSession]);

  const getVehiclesFromSession = (): Vehicle[] => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    const parsed = stored ? JSON.parse(stored) : null;

    return (parsed?.vehicles ?? []).map((vehicle: any) => ({
      chasis_number: vehicle.vehicleno?.value,
      vehicle_make: vehicle.make?.value,
      vehicle_model: vehicle.model?.value,
      first_registered_year: vehicle.firstregistrationdate?.value,
    }));
  };

  const vehicles: Vehicle[] = getVehiclesFromSession();

  const handleSelection = (selected: Vehicle | null) => {
    if (selected) {
      // Retrieve user info from sessionStorage
      const stored = sessionStorage.getItem(ECICS_USER_INFO);
      const parsed = stored ? JSON.parse(stored) : null;

      if (parsed && parsed.vehicles) {
        // Filter vehicles to only include the one matching the selected vehicle
        const filteredVehicles = parsed.vehicles.filter(
          (vehicle: any) => vehicle.vehicleno.value === selected.chasis_number,
        );

        // Update the sessionStorage with the filtered vehicles
        parsed.vehicles = filteredVehicles;

        sessionStorage.removeItem(ECICS_USER_INFO);
        // Save the updated user info back to sessionStorage
        saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(parsed) });
        setRefreshSession((prev) => !prev);
      }
    }
    setShowChooseVehicleModal(false);
  };

  const handleContinue = () => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (!stored) {
      toast.error('Missing user info in session.');
      return;
    }
    const parsed = JSON.parse(stored);

    // Requirement: Check age (between 26 and 70) or (>= 2 years)
    const age = calculateAge(parsed?.dob.value);
    const drivingExperience = calculateDrivingExperienceFromLicences(
      parsed?.drivinglicence?.qdl?.classes || [],
    );
    if (age < 26 || age > 70 || drivingExperience < 2) {
      setShowContactModal(true);
      return;
    }

    // Case 0 vehicle
    if (parsed.vehicles?.length === 0) {
      const v = parsed?.vehicle_selected || {};
      const vehicle_info_selected = {
        chasis_number: v[0].vehicleno?.value || '',
        vehicle_make: v[0].make?.value || '',
        vehicle_model: v[0].model?.value || '',
        first_registered_year:
          extractYear(v[0].firstregistrationdate?.value) || '',
      };
      const qdlClasses = parsed?.drivinglicence?.qdl?.classes || [];

      const payload: SavePersonalInfoPayload = {
        key: `${uuid()}`,
        is_sending_email: false,
        personal_info: {
          name: parsed.name?.value || '',
          gender: parsed.sex?.desc || '',
          marital_status: parsed.marital?.desc || '',
          nric: parsed.uinfin?.value || '',
          address: [
            `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
          ].filter(Boolean),
          date_of_birth: parsed.dob?.value
            ? convertDateToDDMMYYYY(parsed.dob.value)
            : '',
          year_of_registration: parsed.year_of_registration || '',
          driving_experience:
            qdlClasses.length > 0
              ? `${calculateDrivingExperienceFromLicences(qdlClasses)} years`
              : '1 year',
          phone: `${parsed.mobileno?.nbr?.value || ''}`,
          email: parsed.email?.value || '',
        },
        vehicle_info_selected,
        vehicles:
          parsed.vehicles?.map((v: any) => ({
            chasis_number: v.vehicleno?.value || '',
            vehicle_make: v.make?.value || '',
            vehicle_model: v.model?.value || '',
            first_registered_year:
              extractYear(v.firstregistrationdate?.value) || '',
          })) || [],
      };
      savePersonalInfo(payload);
    }

    // Case 1 vehicle
    if (parsed.vehicles?.length === 1) {
      const singleVehicle = parsed.vehicles[0];
      postCheckVehicle({
        vehicle_make: singleVehicle.make?.value,
        vehicle_model: singleVehicle.model?.value,
      });
    }
    // Case > 1 vehicle
    if (parsed.vehicles?.length > 1) {
      setShowChooseVehicleModal(true);
    }
  };

  // Group to show data on Vehicle Details (separated vehicle per box)
  const groupedVehicles: { label: string; value: string | number }[][] = [];
  let currentVehicle: { label: string; value: string | number }[] = [];
  commonInfo?.vehicle?.forEach((item) => {
    if (item.label === 'Vehicle Number') {
      // If there is a vehicle before that, add it to the groupedVehicles list.
      if (currentVehicle.length > 0) {
        groupedVehicles.push(currentVehicle);
      }
      currentVehicle = [item];
    } else {
      // Add another fields to current vehicle
      currentVehicle.push(item);
    }
  });
  // Add last vehicles if possible
  if (currentVehicle.length > 0) {
    groupedVehicles.push(currentVehicle);
  }

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  return (
    <FormProvider {...methods}>
      <div className='flex min-h-screen flex-col'>
        <div className='relative z-10 flex-grow p-6'>
          <div className='flex items-center justify-between'>
            {isMobile ? (
              <>
                <Image
                  src='/singpass.svg'
                  alt='Singpass Logo'
                  width={170}
                  height={170}
                />
                <Image
                  src='/ecics.svg'
                  alt='ECICS Logo'
                  width={100}
                  height={100}
                />
              </>
            ) : (
              <>
                <Image src='/ecics.svg' alt='Logo' width={100} height={100} />
                <Image
                  src='/singpass.svg'
                  alt='Logo'
                  width={170}
                  height={170}
                />
              </>
            )}
          </div>
          <div className='mt-6 text-lg font-bold'>
            Review your Myinfo details
          </div>
          {isMobile ? (
            <div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Email Address</div>
                <InputField name='email' />
              </div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Phone Number</div>
                <InputField name='phone' />
              </div>
              {commonInfo?.personal && (
                <InfoSection title='Personal Info' data={commonInfo.personal} />
              )}
              {!showChooseVehicleModal &&
                !showUnMatchModal &&
                groupedVehicles.length > 0 &&
                groupedVehicles.map((vehicle, index) => (
                  <InfoSection
                    key={index}
                    vehicleIndex={index}
                    title={
                      groupedVehicles.length === 1
                        ? 'Vehicle Details'
                        : `Vehicle Details ${index + 1}`
                    }
                    data={vehicle}
                    setIsDisabled={setIsDisabled}
                  />
                ))}
            </div>
          ) : (
            <div className='w-full justify-self-center'>
              <div className='mt-6 items-center justify-between rounded-md border border-gray-300 bg-gray-100 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-base font-bold'>
                    Enter a valid Email and Contact Number
                  </div>
                  <Tooltip title='We use this information to verify your identity and pre-fill your application with accurate government-verified data. This helps ensure a faster, more secure, and seamless submission process.'>
                    <span className='flex cursor-pointer items-center font-bold'>
                      <WarningIcon size={14} />
                      <span className='ml-1 text-[10px]'>
                        Why do we need this?
                      </span>
                    </span>
                  </Tooltip>
                </div>
                <div className='mt-4 flex gap-4'>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Email Address</div>
                    <InputField name='email' />
                  </div>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Phone Number</div>
                    <InputField name='phone' />
                  </div>
                </div>
              </div>
              {commonInfo?.personal && (
                <InfoSection
                  title='Personal Info'
                  data={commonInfo.personal}
                  boxClass='mt-4'
                />
              )}
              {!showChooseVehicleModal &&
                !showUnMatchModal &&
                groupedVehicles.length > 0 &&
                groupedVehicles.map((vehicle, index) => (
                  <InfoSection
                    key={index}
                    vehicleIndex={index}
                    title={
                      groupedVehicles.length === 1
                        ? 'Vehicle Details'
                        : `Vehicle Details ${index + 1}`
                    }
                    data={vehicle}
                    setIsDisabled={setIsDisabled}
                  />
                ))}
            </div>
          )}
        </div>
        <div className='sticky bottom-0 left-0 right-0 z-20 flex justify-center gap-4 border-t bg-white p-4'>
          <SecondaryButton
            className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
            onClick={handleCloseModal}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleContinue}
            className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
            disabled={isDisabled}
          >
            Continue
          </PrimaryButton>
        </div>
        {showConfirmModal && (
          <ConfirmInfoModalWrapper
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
        {showChooseVehicleModal && (
          <VehicleSelectionModal
            isReviewScreen={true}
            visible={showChooseVehicleModal}
            setShowChooseVehicleModal={setShowChooseVehicleModal}
            vehicles={vehicles}
            setSelected={handleSelection}
          />
        )}
        {showUnMatchModal && (
          <UnMatchVehicleModal onClose={() => setShowUnMatchModal(false)} />
        )}
        {showContactModal && (
          <UnableQuote onClick={handleGoBack} visible={showContactModal} />
        )}
      </div>
    </FormProvider>
  );
};

export default ReviewInfoDetail;
