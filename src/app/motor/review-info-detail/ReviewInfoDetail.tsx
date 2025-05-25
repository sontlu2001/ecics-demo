'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { SavePersonalInfoPayload, Vehicle } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
  formatDateToEnGb,
} from '@/libs/utils/date-utils';
import {
  calculateAge,
  capitalizeWords,
  saveToSessionStorage,
} from '@/libs/utils/utils';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import {
  emailRegex,
  phoneRegex,
  vehicleNumberRegex,
} from '@/constants/validation.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useVerifyRestrictedUser } from '@/hook/cms/verify';
import { usePostCheckVehicle } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import InfoSection from './InfoSection';
import ConfirmInfoModalWrapper from './modal/ConfirmInfoModalWrapper';
import UnMatchVehicleModal from './modal/UnMatchVehicleModal';
import { RenewalModal } from '../insurance/basic-detail/modal/RenewalModal';
import { UnableQuote } from '../insurance/basic-detail/modal/UnableQuote';
import { VehicleSelectionModal } from '../insurance/components/VehicleSelection';

const reviewInfoSchema = z.object({
  email_address: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'Please enter a valid email address.',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  phone_number: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  qualified_driving_license: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'Please select qualified driving license.',
    })
    .min(1, 'This field is required'),
  marital_status: z
    .string({
      required_error: 'This field is required',
    })
    .min(1, 'This field is required'),
  vehicles: z.array(
    z.object({
      vehicle_number: z
        .string({
          required_error: 'This field is required',
        })
        .min(1, 'This field is required')
        .regex(
          vehicleNumberRegex,
          'Please enter a valid vehicle registration no. (e.g. SBA123A).',
        ),

      vehicle_make: z
        .string({
          required_error: 'This field is required',
        })
        .min(1, 'This field is required'),

      vehicle_model: z.union([
        z.string().min(1, 'This field is required'),
        z.null().refine(() => false, { message: 'This field is required' }),
      ]),

      engine_number: z
        .string()
        .max(50, 'Engine Number must be 50 characters or fewer.')
        .optional(),

      chassis_number: z
        .string({
          required_error: 'This field is required',
        })
        .min(1, 'This field is required')
        .max(50, 'Chassis Number must be 50 characters or fewer.'),

      engine_capacity: z
        .string()
        .max(50, 'Engine Capacity must be 50 characters or fewer.')
        .optional(),

      power_rate: z
        .string()
        .max(50, 'Power Rate must be 50 characters or fewer.')
        .optional(),

      year_of_manufacture: z
        .string()
        .max(4, 'Enter a valid year (max 4 digits).')
        .regex(/^\d*$/, 'Year of Manufacture must be numbers only.')
        .optional(),

      year_of_registration: z
        .string({
          required_error: 'This field is required',
        })
        .min(4, 'Enter a valid year'),
    }),
  ),
});

export type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

interface CommonInfo {
  email: string | null;
  phone: string | null;
  personal: Array<{ label: string; value: string }>;
  vehicle: Array<{ label: string; value: string }>;
}

const ReviewInfoDetail = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { isMobile } = useDeviceDetection();

  const partner_code = localStorage.getItem(PARTNER_CODE);
  const promo_code = localStorage.getItem(PROMO_CODE);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commonInfo, setCommonInfo] = useState<CommonInfo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showChooseVehicleModal, setShowChooseVehicleModal] = useState(false);
  const [showUnMatchModal, setShowUnMatchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [refreshSession, setRefreshSession] = useState(false);

  const handleGoBack = () => {
    setShowContactModal(false);
    router.push(ROUTES.MOTOR.LOGIN);
  };

  const { mutate: savePersonalInfo } = usePostPersonalInfo();
  const { mutate: postCheckVehicle, isSuccess } = usePostCheckVehicle(() => {
    setShowUnMatchModal(true);
  });
  const { mutateAsync: verifyRestrictedUser } = useVerifyRestrictedUser();

  useEffect(() => {
    if (isSuccess) {
      const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
      const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);

      if (!sessionDataRaw || !singpassDataRaw) return;

      const parsed = JSON.parse(sessionDataRaw);
      const parsedSingpass = JSON.parse(singpassDataRaw);

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
          vehicle_number: v.vehicleno?.value || '',
          first_registered_year:
            extractYear(v.firstregistrationdate?.value) || '',
          vehicle_make: v.make?.value || '',
          vehicle_model: v.model?.value || '',
          engine_number: v.engineno?.value || '',
          chasis_number: v.chassisno?.value || '',
          engine_capacity: v.enginecapacity?.value || '',
          power_rate: v.powerrate?.value || '',
          year_of_manufacture: v.yearofmanufacture?.value || '',
        };

        const qdlClasses = updatedParsed?.drivinglicence?.qdl?.classes || [];
        const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

        const payload: SavePersonalInfoPayload = {
          key: `${uuid()}`,
          is_sending_email: false,
          promo_code: promo_code || '',
          partner_code: partner_code || '',
          personal_info: {
            name: updatedParsed.name?.value || '',
            gender: updatedParsed.sex?.desc || '',
            marital_status: updatedParsed.marital?.desc || '',
            nric: updatedParsed.uinfin?.value || '',
            address: [
              `${updatedParsed.regadd?.block?.value || ''} ${updatedParsed.regadd?.street?.value || ''} #${updatedParsed.regadd?.floor?.value || ''}-${updatedParsed.regadd?.unit?.value || ''}, ${updatedParsed.regadd?.postal?.value || ''}, ${updatedParsed.regadd?.country?.desc || ''}`,
            ].filter(Boolean),
            post_code: updatedParsed.regadd?.postal?.value || '',
            date_of_birth: updatedParsed.dob?.value
              ? convertDateToDDMMYYYY(updatedParsed.dob.value)
              : '',
            year_of_registration: updatedParsed.year_of_registration || '',
            driving_experience:
              qdlClasses.length > 0
                ? drivingYears >= 6
                  ? '6 years and above'
                  : `${drivingYears} years`
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
          data_from_singpass: parsedSingpass,
        };

        verifyRestrictedUser({
          vehicle_registration_number: vehicle_info_selected?.vehicle_number,
          national_identity_no: updatedParsed.uinfin?.value,
        })
          .then((res) => {
            if (res?.isAllowNewBiz === false) {
              setShowContactModal(true);
            }
            if (res?.isAllowNewBiz === true && res?.isAllowRenewal === true) {
              setShowRenewalModal(true);
            }
          })
          .catch((err) => {
            savePersonalInfo(payload);
          });
      }
    }
  }, [isSuccess]);

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      email_address: '',
      phone_number: '',
      qualified_driving_license: '',
      marital_status: '',
      vehicles: [
        {
          vehicle_number: '',
          vehicle_make: '',
          vehicle_model: null,
          chassis_number: '',
          engine_number: '',
          engine_capacity: '',
          power_rate: '',
          year_of_manufacture: '',
          year_of_registration: '',
        },
      ],
    },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (stored) {
      const parsed = JSON.parse(stored);
      const isInvalidSingleVehicle =
        parsed.vehicles?.length >= 1 &&
        (!parsed.vehicles[0]?.make?.value?.trim() ||
          !parsed.vehicles[0]?.model?.value?.trim());

      const transformed = {
        email: parsed.email?.value || null,
        phone:
          parsed.mobileno?.prefix?.value &&
          parsed.mobileno?.areacode?.value &&
          parsed.mobileno?.nbr?.value
            ? `${parsed.mobileno.prefix.value}${parsed.mobileno.areacode.value} ${parsed.mobileno.nbr.value}`
            : null,
        personal: [
          {
            label: 'Name as per NRIC/FIN',
            value: capitalizeWords(parsed.name?.value) || '',
          },
          {
            label: 'NRIC/FIN',
            value: parsed.uinfin?.value || '',
          },
          {
            label: 'Gender',
            value: capitalizeWords(parsed.sex?.desc) || '',
          },
          {
            label: 'Marital Status',
            value: capitalizeWords(parsed.marital?.desc) || null,
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
            value: parsed.drivinglicence?.qdl?.classes?.some(
              (c: any) => c.class?.value === '3' || c.class?.value === '3A',
            )
              ? parsed.drivinglicence.qdl.classes
                  .map((c: any) => {
                    const cls = c.class?.value || '';
                    const issued = c.issuedate?.value
                      ? formatDateToEnGb(c.issuedate.value)
                      : '';
                    return `${cls} / ${issued}`;
                  })
                  .join(', ')
              : null,
          },
        ],
        vehicle:
          Array.isArray(parsed.vehicles) && parsed.vehicles.length > 0
            ? parsed.vehicles
                .map((v: any, index: number) => {
                  const isTarget = isInvalidSingleVehicle && index === 0;
                  return [
                    {
                      label: 'Vehicle Number',
                      value: v.vehicleno?.value || null,
                    },
                    {
                      label: 'Year of Registration',
                      value:
                        extractYear(v.firstregistrationdate?.value) || null,
                    },
                    {
                      label: 'Vehicle Make',
                      value: isTarget
                        ? null
                        : capitalizeWords(`${v.make?.value || ''}`).trim() ||
                          null,
                    },
                    {
                      label: 'Vehicle Model',
                      value: isTarget
                        ? null
                        : capitalizeWords(`${v.model?.value || ''}`).trim() ||
                          null,
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
                  ];
                })
                .flat()
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

      // Check if any field has "null"
      const hasMissingEmailOrPhone =
        !transformed?.email?.trim() || !transformed?.phone?.trim();
      const hasMissingMaritalStatus = transformed.personal.some(
        (item) =>
          item.label === 'Marital Status' &&
          (item.value == null || item.value.trim() === ''),
      );

      const hasMissingQDL = transformed.personal.find(
        (item) =>
          item.label === 'Qualified Driving License' &&
          (item.value == null || item.value.trim() === ''),
      );
      const hasInvalidVehicle = transformed.vehicle.some(
        (item: any) => item.value === null,
      );
      if (
        hasInvalidVehicle ||
        hasMissingEmailOrPhone ||
        hasMissingQDL ||
        hasMissingMaritalStatus
      ) {
        setIsDisabled(true);
      }

      methods.reset({
        email_address: transformed.email,
        phone_number: transformed.phone ?? undefined,
      });

      if (parsed.vehicles?.length >= 1) {
        const updatedVehicles = parsed.vehicles.map((vehicle: any) => {
          const make = vehicle?.make?.value?.trim();
          const model = vehicle?.model?.value?.trim();

          if (!make || !model) {
            return {
              ...vehicle,
              make: { ...vehicle.make, value: '' },
              model: { ...vehicle.model, value: '' },
            };
          }

          return vehicle;
        });
        const updatedParsed = {
          ...parsed,
          vehicles: updatedVehicles,
        };
        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });
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
    const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);

    if (!stored || !singpassDataRaw) return;

    const parsed = JSON.parse(stored);
    const parsedSingpass = JSON.parse(singpassDataRaw);

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
        vehicle_number: v[0].vehicleno?.value || '',
        first_registered_year:
          extractYear(v[0].firstregistrationdate?.value) || '',
        vehicle_make: v[0].make?.value || '',
        vehicle_model: v[0].model?.value || '',
        engine_number: v[0].engineno?.value || '',
        chasis_number: v[0].chassisno?.value || '',
        engine_capacity: v[0].enginecapacity?.value || '',
        power_rate: v[0].powerrate?.value || '',
        year_of_manufacture: v[0].yearofmanufacture?.value || '',
      };
      const qdlClasses = parsed?.drivinglicence?.qdl?.classes || [];
      const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

      const payload: SavePersonalInfoPayload = {
        key: `${uuid()}`,
        is_sending_email: false,
        promo_code: promo_code || '',
        partner_code: partner_code || '',
        personal_info: {
          name: parsed.name?.value || '',
          gender: parsed.sex?.desc || '',
          marital_status: parsed.marital?.desc || '',
          nric: parsed.uinfin?.value || '',
          address: [
            `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
          ].filter(Boolean),
          post_code: parsed.regadd?.postal?.value || '',
          date_of_birth: parsed.dob?.value
            ? convertDateToDDMMYYYY(parsed.dob.value)
            : '',
          year_of_registration: parsed.year_of_registration || '',
          driving_experience:
            qdlClasses.length > 0
              ? drivingYears >= 6
                ? '6 years and above'
                : `${drivingYears} years`
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
        data_from_singpass: parsedSingpass,
      };
      savePersonalInfo(payload);
    }

    // Case 1 vehicle
    if (parsed.vehicles?.length === 1) {
      const vehicle = parsed.vehicles[0];
      const registrationYearStr = extractYear(
        vehicle.firstregistrationdate?.value,
      );
      const registrationYear = Number(registrationYearStr);
      const currentYear = new Date().getFullYear();
      if (!registrationYear || registrationYear < currentYear - 20) {
        setShowContactModal(true);
      }

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
      <Form
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
        }}
        onFinish={methods.handleSubmit(handleContinue)}
        className='w-full'
      >
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
                <InfoSection
                  title='Enter a valid Email and Contact Number'
                  data={[
                    {
                      label: 'Email Address',
                      value: commonInfo?.email ?? null,
                    },
                    { label: 'Phone Number', value: commonInfo?.phone ?? null },
                  ]}
                  setIsDisabled={setIsDisabled}
                  methods={methods}
                />
                {commonInfo?.personal && (
                  <InfoSection
                    title='Personal Info'
                    data={commonInfo.personal}
                    setIsDisabled={setIsDisabled}
                    methods={methods}
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
                      methods={methods}
                    />
                  ))}
              </div>
            ) : (
              <div className='w-full justify-self-center'>
                <InfoSection
                  title='Enter a valid Email and Contact Number'
                  data={[
                    {
                      label: 'Email Address',
                      value: commonInfo?.email ?? null,
                    },
                    { label: 'Phone Number', value: commonInfo?.phone ?? null },
                  ]}
                  setIsDisabled={setIsDisabled}
                  methods={methods}
                />
                {commonInfo?.personal && (
                  <InfoSection
                    title='Personal Info'
                    data={commonInfo.personal}
                    boxClass='mt-4'
                    setIsDisabled={setIsDisabled}
                    methods={methods}
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
                      methods={methods}
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
              setRefreshSession={setRefreshSession}
            />
          )}
          {showUnMatchModal && (
            <UnMatchVehicleModal
              onClose={() => setShowUnMatchModal(false)}
              setRefreshSession={setRefreshSession}
            />
          )}
          {showContactModal && (
            <UnableQuote onClick={handleGoBack} visible={showContactModal} />
          )}
          {showRenewalModal && (
            <RenewalModal
              onCancel={() => setShowRenewalModal(false)}
              onRenew={() => setShowRenewalModal(false)}
              visible={showRenewalModal}
            />
          )}
        </div>
      </Form>
    </FormProvider>
  );
};

export default ReviewInfoDetail;
