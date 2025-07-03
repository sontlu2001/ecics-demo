'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import {
  SavePersonalInfoPayload,
  VehicleSingPassResponse,
} from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
} from '@/libs/utils/date-utils';
import { calculateAge, capitalizeWords } from '@/libs/utils/utils';

import { NoInfoModal } from '@/components/page/review-info-detail/modal/NoInfoModal';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { QuoteModal } from '@/app/motor/insurance/basic-detail/modal/QuoteModal';
import { RenewalModal } from '@/app/motor/insurance/basic-detail/modal/RenewalModal';
import { UnableQuote } from '@/app/motor/insurance/basic-detail/modal/UnableQuote';
import { MARITAL_STATUS_OPTIONS } from '@/app/motor/insurance/basic-detail/options';
import ConfirmInfoModalWrapper from '@/app/motor/review-info-detail/modal/ConfirmInfoModalWrapper';
import {
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useVerifyRestrictedUser } from '@/hook/cms/verify';
import { useRequestLog } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const reviewInfoSchema = z.object({
  email_address: z
    .string({
      required_error: 'Email address is required',
      invalid_type_error: 'Please enter a valid email address.',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  mobile_number: z
    .string({
      required_error: 'Mobile number is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  marital_status: z
    .string({
      required_error: 'Marital status is required',
    })
    .nonempty('This field is required'),
});

export type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

const ReviewInfoDetail = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const partner_code = localStorage.getItem(PARTNER_CODE);
  const promo_code = localStorage.getItem(PROMO_CODE);

  const carUserInfo = sessionStorage.getItem(ECICS_USER_INFO);
  const userInfoCar = carUserInfo ? JSON.parse(carUserInfo) : null;

  const { mutate: requestLog } = useRequestLog(PRODUCT_NAME.CAR);

  const { mutate: savePersonalInfo, isPending } = usePostPersonalInfo();
  const { mutateAsync: verifyRestrictedUser } = useVerifyRestrictedUser();

  const [showVehicleNotFoundModal, setShowVehicleNotFoundModal] =
    useState(false);
  const [showNotDetectClass3Or3AModal, setShowNotDetectClass3Or3AModal] =
    useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showCSModal, setShowCSModal] = useState<{
    visible: boolean;
    description: string;
  }>({
    visible: false,
    description: '',
  });

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (userInfoCar) {
      // initial email
      methods.setValue('email_address', userInfoCar?.email?.value ?? '');
      // initial mobile
      methods.setValue(
        'mobile_number',
        userInfoCar?.mobileno?.nbr?.value ?? '',
      );
      // initial marital status
      const maritalDesc = userInfoCar?.marital?.desc ?? '';
      const matchedOption = MARITAL_STATUS_OPTIONS.find(
        (opt) => String(opt.value).toUpperCase() === maritalDesc.toUpperCase(),
      );
      if (matchedOption) {
        methods.setValue('marital_status', String(matchedOption.value));
      }
    }
  }, []);

  const floor = userInfoCar?.regadd?.floor?.value;
  const unit = userInfoCar?.regadd?.unit?.value;

  const personal_info = [
    {
      title: 'Name as per NRIC',
      value: capitalizeWords(userInfoCar?.name?.value) || 'N/A',
    },
    {
      title: 'Gender',
      value: capitalizeWords(userInfoCar?.sex?.desc) || 'N/A',
    },
    {
      title: 'Date of Birth',
      value: convertDateToDDMMYYYY(userInfoCar?.dob?.value) || 'N/A',
    },
    {
      title: 'NRIC / FIN',
      value: userInfoCar?.uinfin?.value || 'N/A',
    },
    {
      title: 'Marital Status',
      value: userInfoCar?.marital?.desc || 'N/A',
    },
    {
      title: 'Address Line 1',
      value:
        capitalizeWords(
          `${userInfoCar?.regadd?.block?.value ?? ''} ${userInfoCar?.regadd?.street?.value ?? ''}`.trim(),
        ) || 'N/A',
    },
    {
      title: 'Address Line 2',
      value: floor && unit ? capitalizeWords(`#${floor}-${unit}`) : 'N/A',
    },
    {
      title: 'Address Line 3',
      value: capitalizeWords(userInfoCar?.regadd?.country?.desc) || 'N/A',
    },
    {
      title: 'Postal Code',
      value: userInfoCar?.regadd?.postal?.value || 'N/A',
    },
  ];

  const getVehicleTopRow = (vehicle: VehicleSingPassResponse) => [
    {
      title: 'Vehicle Make',
      value: vehicle.make?.value || 'N/A',
    },
    {
      title: 'Vehicle Model',
      value: vehicle.model?.value || 'N/A',
    },
    {
      title: 'First Registration Date',
      value: convertDateToDDMMYYYY(vehicle.firstregistrationdate?.value || ''),
    },
    {
      title: 'Year of Manufacture',
      value: vehicle.yearofmanufacture?.value || 'N/A',
    },
  ];

  const getVehicleBottomRow = (vehicle: VehicleSingPassResponse) => [
    {
      title: 'Engine Number',
      value: vehicle.engineno?.value || 'N/A',
    },
    {
      title: 'Chassis Number',
      value: vehicle.chassisno?.value || 'N/A',
    },
    {
      title: 'Power Rate',
      value: vehicle.powerrate?.value || 'N/A',
    },
    {
      title: 'Engine Capacity',
      value: vehicle.enginecapacity?.value
        ? `${vehicle.enginecapacity.value} CC`
        : 'N/A',
    },
  ];
  const qdl = userInfoCar?.drivinglicence?.qdl ?? {};
  const drivingClasses = qdl.classes ?? [];
  const expiryDate = qdl.expirydate?.value ?? 'N/A';
  const validityDesc = qdl.validity?.desc ?? 'N/A';

  const callApiPersonalInfo = () => {
    const singpassDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
    if (!singpassDataRaw) return;
    const parsedSingpass = JSON.parse(singpassDataRaw);

    if (
      Array.isArray(parsedSingpass.vehicles) &&
      parsedSingpass.vehicles.length === 1
    ) {
      const qdlClasses = parsedSingpass?.drivinglicence?.qdl?.classes || [];
      const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

      const payload: SavePersonalInfoPayload = {
        key: `${uuid()}`,
        is_sending_email: false,
        promo_code: promo_code || '',
        partner_code: partner_code || '',
        product_type: 'car',
        personal_info: {
          name: parsedSingpass.name?.value || '',
          gender: parsedSingpass.sex?.desc || '',
          marital_status: parsedSingpass.marital?.desc || '',
          nric: parsedSingpass.uinfin?.value || '',
          address: [
            `${parsedSingpass.regadd?.block?.value || ''} ${parsedSingpass.regadd?.street?.value || ''} #${parsedSingpass.regadd?.floor?.value || ''}-${parsedSingpass.regadd?.unit?.value || ''}, ${parsedSingpass.regadd?.postal?.value || ''}, ${parsedSingpass.regadd?.country?.desc || ''}`,
          ].filter(Boolean),
          post_code: parsedSingpass.regadd?.postal?.value || '',
          date_of_birth: parsedSingpass.dob?.value
            ? convertDateToDDMMYYYY(parsedSingpass.dob.value)
            : '',
          driving_experience: String(drivingYears) || '',
          phone: `${parsedSingpass.mobileno?.nbr?.value || ''}`,
          email: parsedSingpass.email?.value?.toLowerCase() || '',
        },
        vehicles:
          parsedSingpass.vehicles?.map((v: any) => ({
            vehicle_make: v.make?.value || '',
            vehicle_model: v.model?.value || '',
            first_registered_year: v.firstregistrationdate?.value || '',
            year_of_manufacture: v.yearofmanufacture?.value || '',
            engine_number: v.engineno?.value || '',
            chassis_number: v.vehicleno?.value || '',
            power_rate: v.powerrate?.value || '',
            engine_capacity: v.enginecapacity?.value || '',
          })) || [],
        data_from_singpass: parsedSingpass,
      };

      verifyRestrictedUser({
        national_identity_no: parsedSingpass.uinfin?.value,
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
  };

  const handleNext = () => {
    // Check vehicle not found
    const vehicles = userInfoCar?.vehicles || [];
    const hasVehicle =
      vehicles.length > 0 && vehicles.some((v: any) => v?.vehicleno?.value);
    if (!hasVehicle) {
      setShowVehicleNotFoundModal(true);
      return;
    }
    // Check hasClass3Or3A
    const hasClass3Or3A = drivingClasses.some(
      (cls: any) => cls.class?.value === '3' || cls.class?.value === '3A',
    );
    if (!hasClass3Or3A) {
      setShowNotDetectClass3Or3AModal(true);
      return;
    }
    // Check driver age
    const driverAge = userInfoCar?.dob?.value || [];
    if (driverAge) {
      const age = calculateAge(driverAge);
      if (age >= 71) {
        setShowCSModal({
          visible: true,
          description: 'The driver is above 70 years of age.',
        });
      }
    }
    // Check years of driving experience.
    const drivingExperience = calculateDrivingExperienceFromLicences(
      userInfoCar?.drivinglicence?.qdl?.classes || [],
    );
    if (drivingExperience < 2) {
      setShowCSModal({
        visible: true,
        description:
          'The listed driver has less than 2 years of driving experience.',
      });
    }
    // Call api savePersonalInfo
    callApiPersonalInfo();
  };

  const handleCancel = () => {
    // setShowConfirmModal(true);
    router.push(ROUTES.MOTOR.LOGIN); //temporary solution
  };

  const handleExit = () => {
    setShowVehicleNotFoundModal(false);
    setShowNotDetectClass3Or3AModal(false);
    router.push(ROUTES.MOTOR.LOGIN);
  };

  const handleContinue = () => {
    requestLog();
    const basePath = ROUTES.INSURANCE.BASIC_DETAIL_MANUAL;

    const queryParams = new URLSearchParams();
    if (promo_code) queryParams.append('promo_code', promo_code);
    if (partner_code) queryParams.append('partner_code', partner_code);
    const queryString = queryParams.toString();

    router.push(`${basePath}${queryString ? `&${queryString}` : ''}`);
  };

  const handleGoBack = () => {
    setShowContactModal(false);
    router.push(ROUTES.MOTOR.LOGIN);
  };

  return (
    <>
      <FormProvider {...methods}>
        <Form
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
          onFinish={methods.handleSubmit(handleNext)}
          className='w-full'
          initialValues={{
            email_address: userInfoCar?.email?.value || '',
          }}
        >
          <div className='flex min-h-screen flex-col px-[20px] py-6 md:px-20'>
            <div className='fixed left-0 right-0 top-0 z-[100] bg-white px-[20px] py-6 md:px-20'>
              <div className='flex items-center justify-between'>
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
              </div>
            </div>
            <div className='scrollbar-hide h-screen overflow-y-auto pb-[150px] pt-[25px]'>
              <div className='mt-6 text-2xl font-bold'>
                Review your Myinfo details
              </div>
              <div className='relative w-full' style={{ zIndex: '99' }}>
                <div className='w-full'>
                  <div className='my-3 text-lg font-bold underline'>
                    Contact Info
                  </div>
                  <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                    <Form.Item
                      name='email_address'
                      validateStatus={errors.email_address ? 'error' : ''}
                    >
                      <InputField
                        name='email_address'
                        label='Email Address'
                        isRequired
                        placeholder='Enter Your Email Address'
                      />
                    </Form.Item>

                    <Form.Item
                      name='mobile_number'
                      validateStatus={errors.mobile_number ? 'error' : ''}
                    >
                      <InputField
                        name='mobile_number'
                        label='Mobile Number'
                        isRequired
                        placeholder='Enter Your Mobile Number'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const onlyNums = e.target.value.replace(/\D/g, '');
                          methods.setValue('mobile_number', onlyNums, {
                            shouldValidate: true,
                          });
                        }}
                        value={String(watch('mobile_number') ?? '')}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className='my-6 mt-[32px] w-full'>
                  <div className='my-3 text-lg font-bold underline'>
                    Personal Info
                  </div>
                  <div
                    className={`grid gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
                      isMobile ? 'grid-cols-2' : 'sm:grid-cols-3'
                    }`}
                  >
                    {personal_info.map((item, index) => {
                      if (index === 4) {
                        return (
                          <Form.Item
                            key='marital_status'
                            name='marital_status'
                            validateStatus={
                              errors.marital_status ? 'error' : ''
                            }
                          >
                            <>
                              <DropdownField
                                name='marital_status'
                                label='Marital Status'
                                placeholder='Select Marital Status'
                                options={MARITAL_STATUS_OPTIONS}
                                isRequired
                                onChange={(value) => {
                                  methods.setValue('marital_status', value, {
                                    shouldValidate: true,
                                  });
                                }}
                              />
                            </>
                          </Form.Item>
                        );
                      }

                      return (
                        <div key={index}>
                          <div className='text-base font-medium'>
                            {item.title}
                          </div>
                          <div className='whitespace-normal break-words'>
                            {item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {drivingClasses.length > 0 && (
                <div className='mt-[32px] w-full'>
                  <div className='my-3 text-lg font-bold underline'>
                    Driving License
                  </div>
                  <div
                    className={`grid gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
                      isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'
                    }`}
                  >
                    {drivingClasses.map((cls: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className='relative rounded-[6px] border-[1px] border-gray-300 bg-white px-4 py-2 shadow-sm'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='mb-2 text-base font-bold'>
                              Class {cls.class?.value}
                            </div>
                            <div
                              className={`mb-2 rounded-[10px] px-[14px] py-[2px] text-base font-semibold text-white ${
                                validityDesc === 'VALID'
                                  ? 'bg-[#34C759]'
                                  : validityDesc === 'EXPIRED'
                                    ? 'bg-[#F9B776]'
                                    : validityDesc === 'INVALID'
                                      ? 'bg-[#FF3B30]'
                                      : ''
                              }`}
                            >
                              {capitalizeWords(validityDesc)}
                            </div>
                          </div>
                          <div className='absolute left-0 right-0 h-[1px] bg-gray-200'></div>
                          <div className='mt-4 grid grid-cols-2 gap-x-5 text-sm'>
                            <div>
                              <div className='text-sm font-light'>
                                Issued Date
                              </div>
                              <div className='text-base font-semibold'>
                                {convertDateToDDMMYYYY(cls.issuedate?.value) ||
                                  'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className='text-sm font-light'>
                                Expiry Date
                              </div>
                              <div className='text-base font-semibold'>
                                {convertDateToDDMMYYYY(expiryDate) || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {userInfoCar?.vehicles.length > 0 && (
                <div className='mt-[32px] w-full'>
                  <div className='my-3 text-lg font-bold underline'>
                    Vehicle Details
                  </div>
                  <div
                    className={`grid gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
                      isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'
                    }`}
                  >
                    {(userInfoCar?.vehicles as VehicleSingPassResponse[])
                      ?.filter((vehicle) => vehicle.status?.desc === 'LIVE')
                      ?.map((vehicle, index) => (
                        <div
                          key={index}
                          className='rounded-md border border-gray-300 bg-white shadow-sm'
                        >
                          <div className='flex items-center justify-between px-4 py-2'>
                            <div className='text-base font-bold'>
                              {vehicle.vehicleno?.value ?? 'N/A'}
                            </div>
                            <div className='rounded-[10px] bg-[#34C759] px-[14px] py-[2px] text-base font-semibold text-white'>
                              {capitalizeWords(vehicle.status?.desc) ?? 'N/A'}
                            </div>
                          </div>
                          <div className='h-[1px] w-full bg-gray-200'></div>
                          <div className='mb-2 mt-[10px] grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
                            {getVehicleTopRow(vehicle).map((item, idx) => (
                              <div key={idx}>
                                <div className='text-sm font-light'>
                                  {item.title}
                                </div>
                                <div className='whitespace-normal break-words text-base font-semibold'>
                                  {item.value || 'N/A'}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className='mb-[12px] mt-4 grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
                            {getVehicleBottomRow(vehicle).map((item, idx) => (
                              <div key={idx}>
                                <div className='text-sm font-light'>
                                  {item.title}
                                </div>
                                <div className='whitespace-normal break-words text-base font-semibold'>
                                  {item.value || 'N/A'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Form>
      </FormProvider>

      <div
        className='fixed bottom-0 w-full border-[1px] border-gray-100 bg-white px-2 shadow-md shadow-gray-200'
        style={{ zIndex: 100 }}
      >
        <div className='mx-auto w-full max-w-[1380px]'>
          <div
            className={`flex w-full items-center justify-between py-3 md:py-6 ${
              isMobile ? 'gap-[14px]' : ''
            }`}
          >
            <SecondaryButton
              className={`rounded-none ${
                isMobile
                  ? 'w-full'
                  : 'w-[10vw] min-w-[150px] px-4 py-2 md:w-[10vw]'
              }`}
              danger
              onClick={handleCancel}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={() => form.submit()}
              className={`${
                isMobile ? 'w-full' : 'ml-[6px] md:w-40'
              } bg-green-promo text-right`}
              loading={isPending}
            >
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
      {/*{showConfirmModal && (*/}
      {/*    <ConfirmInfoModalWrapper*/}
      {/*        showConfirmModal={showConfirmModal}*/}
      {/*        setShowConfirmModal={setShowConfirmModal}*/}
      {/*    />*/}
      {/*)}*/}
      {showVehicleNotFoundModal && (
        <NoInfoModal
          title='Vehicle Information Not Found'
          onExit={handleCancel}
          onContinue={handleCancel}
          description='unable to detect a registered vehicle under your name.'
        />
      )}
      {showNotDetectClass3Or3AModal && (
        <NoInfoModal
          title='No Valid Driving License'
          onExit={handleExit}
          onContinue={handleContinue}
          description='unable to detect a valid Class 3 driving license'
        />
      )}
      <QuoteModal
        onClick={() => setShowCSModal({ ...showCSModal, visible: false })}
        visible={showCSModal.visible}
        description={showCSModal.description}
      />
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
    </>
  );
};

export default ReviewInfoDetail;
