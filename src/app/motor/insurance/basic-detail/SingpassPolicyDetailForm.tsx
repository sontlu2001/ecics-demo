'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import {
  adjustDateInDayjs,
  convertDateToDDMMYYYY,
  dateToDayjs,
  extractYear,
} from '@/libs/utils/date-utils';
import { formatPromoCode } from '@/libs/utils/utils';

import { PricingSummary } from '@/components/page/FeeBar';
import UnMatchVehicleModal from '@/components/page/insurance/policy-detail/modal/UnMatchVehicleModal';
import HeaderVehicleOption from '@/components/page/review-info-detail/HeaderVehicleOption';
import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownField,
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { MOTOR_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { usePostCheckVehicle } from '@/hook/insurance/common';
import { useGetQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { setUserInfoCar } from '@/redux/slices/userInfoCar.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { QuoteModal } from './modal/QuoteModal';
import {
  NCD_OPTIONS,
  NO_CLAIM_OPTIONS,
  NumberClaim,
  ProductType,
  REG_YEAR_OPTIONS,
} from './options';
import { PromoCodeField } from '../components/PromoCode';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const sryMsg =
  'Please contact us for assistance at +65 6206 5588 or customerservice@ecics.com.sg';

type MissingFields = {
  engine_number?: boolean;
  chassis_number?: boolean;
  reg_yyyy?: boolean;
};

const singpassFlowFields = (missing: MissingFields = {}) => ({
  [MOTOR_QUOTE.hire_purchase]: z.number({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTOR_QUOTE.other_hire_purchase]: z.string().optional(),
  [MOTOR_QUOTE.start_date]: z
    .date({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .refine((date) => dayjs(date).isSameOrAfter(dayjs(), 'day'), {
      message: 'Start date cannot be earlier than today',
    })
    .refine(
      (date) => dayjs(date).isSameOrBefore(dayjs().add(90, 'days'), 'day'),
      { message: 'Start date cannot be later than 90 days from today' },
    ),
  [MOTOR_QUOTE.end_date]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTOR_QUOTE.owner_ncd]: z.number({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.owner_no_of_claims]: z
    .string({
      required_error: 'This field is required',
    })
    .refine((val) => val !== NumberClaim.TWO_MANY_CLAIMS, {
      message: sryMsg,
    }),
  [MOTOR_QUOTE.engine_number]: z.string().optional(),
  [MOTOR_QUOTE.chassis_number]: missing?.chassis_number
    ? z.string({ required_error: 'This field is required' })
    : z.string().optional(),
  [MOTOR_QUOTE.reg_yyyy]: missing?.reg_yyyy
    ? z.string({ required_error: 'This field is required' })
    : z.string().optional(),
  [MOTOR_QUOTE.promo_code]: z.string().optional(),
});

const ID_OPTION_OTHER = 2; //-- Others (Not Available in this list) --

const createSchema = (missing: MissingFields = {}) => {
  const baseSchema = z.object(singpassFlowFields(missing));

  return baseSchema
    .refine(
      (data) => {
        const startDate = data[MOTOR_QUOTE.start_date];
        const endDate = data[MOTOR_QUOTE.end_date];
        if (!startDate || !endDate) {
          return false;
        }
        const minEndDate = adjustDateInDayjs(
          dateToDayjs(startDate as Date),
          0,
          10,
          -1,
        );
        return dayjs(endDate as Date).isSameOrAfter(minEndDate);
      },
      {
        message:
          'Policy end date must be at least 10 months after the start date',
        path: [MOTOR_QUOTE.end_date],
      },
    )
    .refine(
      (data) => {
        const startDate = data[MOTOR_QUOTE.start_date];
        const endDate = data[MOTOR_QUOTE.end_date];
        if (!startDate || !endDate) {
          return false;
        }
        const maxEndDate = adjustDateInDayjs(
          dateToDayjs(startDate as Date),
          0,
          18,
          -1,
        );
        return dayjs(endDate as Date).isSameOrBefore(maxEndDate);
      },
      {
        message:
          'Policy end date cannot be more than 18 months after the start date',
        path: [MOTOR_QUOTE.end_date],
      },
    )
    .superRefine((data, ctx) => {
      if (data[MOTOR_QUOTE.hire_purchase] === ID_OPTION_OTHER) {
        const value = data[MOTOR_QUOTE.other_hire_purchase];

        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This field is required',
            path: [MOTOR_QUOTE.other_hire_purchase],
          });
        }
      }
    });
};

type SingpassFlowFields = z.infer<ReturnType<typeof createSchema>>;
type FormData = SingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  hirePurchaseOptions: DropdownOption[];
  isLoading?: boolean;
}

const SingpassPolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  hirePurchaseOptions,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();

  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';

  const { data: quoteInfo } = useGetQuote(key);

  useEffect(() => {
    const carUserInfo = quoteInfo?.data;

    // Data has been updated later via Singpass or user selected manually
    const hasSelectedVehicle = !!userInfo?.vehicle_selected;
    const hasListAfterSelected =
      userInfo?.list_after_selected_vehicle?.length > 0;

    const hasSingpassVehicles =
      userInfo?.data_from_singpass?.vehicles?.length > 0;

    if (
      carUserInfo &&
      !hasSelectedVehicle &&
      !hasListAfterSelected &&
      !hasSingpassVehicles
    ) {
      dispatch(setUserInfoCar(carUserInfo));
    }
  }, [quoteInfo, dispatch]);

  const userInfo = useAppSelector((state) => state.userInfoCar?.userInfoCar);

  const userInfoCarSingPass = userInfo.data_from_singpass;

  const initPromoCode = initialValues?.[MOTOR_QUOTE.promo_code] ?? promoDefault;

  const [showCSModal, setShowCSModal] = useState<{
    visible: boolean;
    description: string;
  }>({
    visible: false,
    description: '',
  });
  const [applyPromoCode, setApplyPromoCode] = useState(initPromoCode);
  const [showUnMatchModal, setShowUnMatchModal] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [missingFields, setMissingFields] = useState<{
    engine_number?: boolean;
    chassis_number?: boolean;
    reg_yyyy?: boolean;
  }>({});

  const schema = useMemo(() => createSchema(missingFields), [missingFields]);

  const { mutate: postCheckVehicle } = usePostCheckVehicle(() => {
    setShowUnMatchModal(true);
  });

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initialValues,
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  // input field change
  const start_date = watch(MOTOR_QUOTE.start_date) as Date;
  const date_of_birth = watch(MOTOR_QUOTE.owner_dob) as Date;
  const hire_purchase = watch(MOTOR_QUOTE.hire_purchase);
  const no_claim = watch(MOTOR_QUOTE.owner_no_of_claims) as string;

  const handleBackLogin = () => {
    router.push(ROUTES.MOTOR.LOGIN);
  };

  useEffect(() => {
    setApplyPromoCode(initPromoCode);
  }, [initPromoCode]);

  useEffect(() => {
    if (hire_purchase !== ID_OPTION_OTHER) {
      methods.setValue(MOTOR_QUOTE.other_hire_purchase, '');
    }
  }, [hire_purchase]);

  useEffect(() => {
    if (no_claim === NumberClaim.TWO_MANY_CLAIMS) {
      setShowCSModal({
        visible: true,
        description:
          'The listed driver has reported more than 2 claims or claims exceeding SGD 20,000.',
      });
    }
  }, [no_claim]);

  // Register onSave callback to collect current form values
  useEffect(() => {
    onSaveRegister(() => {
      const value = methods.getValues();
      const vehicle_info_selected = {
        vehicle_number: userInfo?.vehicle_selected?.vehicleno.value,
        vehicle_make: userInfo?.vehicle_selected?.make.value,
        vehicle_model: userInfo?.vehicle_selected?.model.value,
        first_registered_year: missingFields.reg_yyyy
          ? (value[MOTOR_QUOTE.reg_yyyy] as string)
          : extractYear(
              userInfoCarSingPass.vehicles[0].firstregistrationdate.value,
            ),
        year_of_manufacture:
          userInfo?.vehicle_selected?.yearofmanufacture.value,
        engine_number: userInfo?.vehicle_selected?.engineno.value,
        chasis_number: userInfo?.vehicle_selected?.chassisno.value,
        engine_capacity: userInfo?.vehicle_selected?.enginecapacity.value,
        power_rate: userInfo?.vehicle_selected?.powerrate.value,
      };

      const personalInfo = quoteInfo?.data?.personal_info;
      const personal_info = {
        date_of_birth: dayjs(personalInfo?.date_of_birth, 'DD/MM/YYYY').format(
          'DD/MM/YYYY',
        ),
        driving_experience: personalInfo?.driving_experience || '',
        phone: personalInfo?.phone || '',
        email: personalInfo?.email || '',
      };

      const payload = {
        key: key,
        partner_code: partnerCode,
        promo_code: applyPromoCode,
        company_id: value[MOTOR_QUOTE.hire_purchase],
        company_name_other: value[MOTOR_QUOTE.other_hire_purchase] || '',
        personal_info: personal_info,
        vehicle_info_selected: vehicle_info_selected,
        insurance_additional_info: {
          no_claim_discount: value[MOTOR_QUOTE.owner_ncd],
          no_of_claim: value[MOTOR_QUOTE.owner_no_of_claims],
          start_date: dayjs(value[MOTOR_QUOTE.start_date] as Date).format(
            'DD/MM/YYYY',
          ),
          end_date: dayjs(value[MOTOR_QUOTE.end_date] as Date).format(
            'DD/MM/YYYY',
          ),
          last_claim_amount: value[MOTOR_QUOTE.owner_claim_amount],
        },
      };
      return payload;
    });
  }, [methods, onSaveRegister]);

  const handleChangeStartDate = (date: any) => {
    const startDate = dateToDayjs(date?.toDate());
    const defaultEndDate = adjustDateInDayjs(startDate, 1, 0, -1);
    if (!defaultEndDate) {
      methods.setValue(MOTOR_QUOTE.end_date, null as any);
      return;
    }
    methods.setValue(MOTOR_QUOTE.end_date, defaultEndDate.toDate());
    methods.trigger([MOTOR_QUOTE.end_date], { shouldFocus: false });
  };

  const hire_purchase_section = (
    <>
      <Form.Item
        name={MOTOR_QUOTE.hire_purchase}
        validateStatus={errors[MOTOR_QUOTE.hire_purchase] ? 'error' : ''}
        className='mb-1'
      >
        <LongOptionDropdownField
          name={MOTOR_QUOTE.hire_purchase}
          label='Vehicle Financed By'
          isRequired
          placeholder='Select name of finance company'
          options={hirePurchaseOptions}
          showSearch
        />
      </Form.Item>

      {hire_purchase === ID_OPTION_OTHER && (
        <Form.Item
          name={MOTOR_QUOTE.other_hire_purchase}
          validateStatus={
            errors[MOTOR_QUOTE.other_hire_purchase] ? 'error' : ''
          }
          className='mb-1'
        >
          <InputField
            name={MOTOR_QUOTE.other_hire_purchase}
            label='Your Hire Purchase Company'
            isRequired
            placeholder='Please enter your hire purchase company'
          />
        </Form.Item>
      )}
    </>
  );

  const handleSubmit = (value: FormData) => {
    const vehicle_info_selected = {
      vehicle_number: userInfo?.vehicle_selected?.vehicleno.value,
      vehicle_make: userInfo?.vehicle_selected?.make.value,
      vehicle_model: userInfo?.vehicle_selected?.model.value,
      first_registered_year: missingFields.reg_yyyy
        ? (value[MOTOR_QUOTE.reg_yyyy] as string)
        : extractYear(
            userInfoCarSingPass.vehicles[0].firstregistrationdate.value,
          ),
      year_of_manufacture: userInfo?.vehicle_selected?.yearofmanufacture.value,
      engine_number: userInfo?.vehicle_selected?.engineno.value,
      chasis_number: userInfo?.vehicle_selected?.chassisno.value,
      engine_capacity: userInfo?.vehicle_selected?.enginecapacity.value,
      power_rate: userInfo?.vehicle_selected?.powerrate.value,
    };

    const personalInfo = quoteInfo?.data?.personal_info;
    const personal_info = {
      date_of_birth: dayjs(personalInfo?.date_of_birth, 'DD/MM/YYYY').format(
        'DD/MM/YYYY',
      ),
      driving_experience: personalInfo?.driving_experience || '',
      phone: personalInfo?.phone || '',
      email: personalInfo?.email || '',
    };

    const noOfClaim = value[MOTOR_QUOTE.owner_no_of_claims];
    const promoCode =
      noOfClaim === NumberClaim.NEVER ? formatPromoCode(applyPromoCode) : '';
    const payload = {
      key: key,
      partner_code: partnerCode,
      promo_code: promoCode,
      company_id: value[MOTOR_QUOTE.hire_purchase],
      company_name_other: value[MOTOR_QUOTE.other_hire_purchase] || '',
      personal_info: personal_info,
      vehicle_info_selected: vehicle_info_selected,
      insurance_additional_info: {
        no_claim_discount: value[MOTOR_QUOTE.owner_ncd],
        no_of_claim: value[MOTOR_QUOTE.owner_no_of_claims],
        start_date: dayjs(value[MOTOR_QUOTE.start_date] as Date).format(
          'DD/MM/YYYY',
        ),
        end_date: dayjs(value[MOTOR_QUOTE.end_date] as Date).format(
          'DD/MM/YYYY',
        ),
      },
    };

    onSubmit(payload);
  };

  const isEnablePromoCode = no_claim === NumberClaim.NEVER || !no_claim;

  const minPolicyStartDate = useMemo(() => dayjs(), []);
  const maxPolicyStartDate = useMemo(() => dayjs().add(90, 'day'), []);

  const minPolicyEndDate = useMemo(() => {
    const startDateDayjs = dateToDayjs(start_date);
    const minEligibleDate = adjustDateInDayjs(startDateDayjs, 0, 10, -1);
    return minEligibleDate;
  }, [start_date]);
  const maxPolicyEndDate = useMemo(() => {
    const startDateDayjs = dateToDayjs(start_date);
    const maxEligibleDate = adjustDateInDayjs(startDateDayjs, 0, 18, -1);
    return maxEligibleDate;
  }, [start_date]);

  useEffect(() => {
    if (!date_of_birth || !start_date) return;

    const policyStartDate = dayjs(start_date);
    const dobDate = dayjs(date_of_birth);
    const ageAtPolicyStart = policyStartDate.diff(dobDate, 'year');
    const isOutOfRange = ageAtPolicyStart < 26 || ageAtPolicyStart >= 71;

    if (isOutOfRange) {
      setShowCSModal({
        visible: true,
        description:
          ageAtPolicyStart < 26
            ? 'The driver is below 26 years of age.'
            : 'The driver is above 70 years of age.',
      });
      methods.setValue(MOTOR_QUOTE.owner_dob, undefined, {
        shouldValidate: true,
      });
    }
  }, [start_date, date_of_birth]);

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
      value: vehicle.powerrate?.value?.toString() || 'N/A',
    },
    {
      title: 'Engine Capacity',
      value: vehicle.enginecapacity?.value
        ? `${vehicle.enginecapacity.value} CC`
        : 'N/A',
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <Form
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
          onFinish={methods.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className=' mb-16 flex w-full flex-col items-center px-4'
          {...props}
        >
          <div className='max-w-[1200px]'>
            <HeaderVehicleOption
              vehicles={userInfoCarSingPass?.vehicles ?? []}
              listAfterSelectedVehicle={
                userInfo?.list_after_selected_vehicle ?? []
              }
              isMobile={isMobile}
              getVehicleTopRow={getVehicleTopRow}
              getVehicleBottomRow={getVehicleBottomRow}
              onVehicleSelect={(
                missing,
                vehicleAge,
                vehicleNumber,
                make,
                model,
              ) => {
                // Check missing fields
                setMissingFields(missing);
                // Check vehicle age
                if (vehicleAge != null && vehicleAge > 15) {
                  setShowCSModal({
                    visible: true,
                    description:
                      'The vehicle is more than 15 years old based on its registration year.',
                  });
                }
                setVehicleNumber(vehicleNumber);
                // Show UnMatchVehicleModal if missing make or model
                if (missing?.make || missing?.model) {
                  setShowUnMatchModal(true);
                } else {
                  setShowUnMatchModal(false);
                }
                // Check Vehicle (make,model)
                postCheckVehicle({
                  vehicle_make: make,
                  vehicle_model: model,
                });
              }}
            />

            {['engine_number', 'chassis_number', 'reg_yyyy'].some(
              (key) => missingFields[key as keyof typeof missingFields],
            ) && (
              <div className='mt-[32px] w-full'>
                <div className='my-3 text-lg font-bold underline'>
                  Missing Information (Missing from Singpass)
                </div>
                <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                  {missingFields.engine_number && (
                    <Form.Item
                      name={MOTOR_QUOTE.engine_number}
                      validateStatus={
                        errors[MOTOR_QUOTE.engine_number] ? 'error' : ''
                      }
                    >
                      <InputField
                        name={MOTOR_QUOTE.engine_number}
                        label='Engine Number'
                        placeholder='Enter your engine number'
                      />
                    </Form.Item>
                  )}

                  {missingFields.chassis_number && (
                    <Form.Item
                      name={MOTOR_QUOTE.chassis_number}
                      validateStatus={
                        errors[MOTOR_QUOTE.chassis_number] ? 'error' : ''
                      }
                    >
                      <InputField
                        name={MOTOR_QUOTE.chassis_number}
                        label='Chassis Number'
                        isRequired
                        placeholder='Enter your chassis number'
                      />
                    </Form.Item>
                  )}

                  {missingFields.reg_yyyy && (
                    <Form.Item name={MOTOR_QUOTE.reg_yyyy}>
                      <DropdownField
                        name={MOTOR_QUOTE.reg_yyyy}
                        label="Vehicle's Year of Registration"
                        isRequired
                        placeholder='Select registration year'
                        options={REG_YEAR_OPTIONS}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>
            )}

            <div className='mt-[32px] w-full'>
              <div className='my-3 text-lg font-bold underline'>
                Policy Details
              </div>
              <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                <Form.Item
                  name={MOTOR_QUOTE.start_date}
                  validateStatus={errors[MOTOR_QUOTE.start_date] ? 'error' : ''}
                >
                  <DatePickerField
                    name={MOTOR_QUOTE.start_date}
                    label='Policy Start Date'
                    isRequired
                    minDate={minPolicyStartDate}
                    maxDate={maxPolicyStartDate}
                    onChange={handleChangeStartDate}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name={MOTOR_QUOTE.end_date}
                  validateStatus={errors[MOTOR_QUOTE.end_date] ? 'error' : ''}
                >
                  <DatePickerField
                    label='Policy End Date'
                    name={MOTOR_QUOTE.end_date}
                    isRequired
                    minDate={minPolicyEndDate}
                    maxDate={maxPolicyEndDate}
                    disabled={!start_date || isLoading}
                  />
                </Form.Item>

                <Form.Item name={MOTOR_QUOTE.owner_ncd}>
                  <DropdownField
                    name={MOTOR_QUOTE.owner_ncd}
                    label='No Claim Discount'
                    isRequired
                    placeholder='Select your current NCD'
                    options={NCD_OPTIONS}
                  ></DropdownField>
                </Form.Item>

                <Form.Item
                  name={MOTOR_QUOTE.owner_no_of_claims}
                  validateStatus={
                    errors[MOTOR_QUOTE.owner_no_of_claims] ? 'error' : ''
                  }
                >
                  <DropdownField
                    name={MOTOR_QUOTE.owner_no_of_claims}
                    label='Number of claims in the past 3 years'
                    isRequired
                    placeholder='Select number of claims'
                    options={NO_CLAIM_OPTIONS}
                  />
                </Form.Item>
                {hire_purchase_section}
              </div>
            </div>

            <div className='mt-6 w-full justify-items-center'>
              <div className='w-[90vw] md:w-96'>
                <PromoCodeField
                  placeholder='Enter promo code'
                  applyPromoCode={applyPromoCode}
                  setApplyPromoCode={setApplyPromoCode}
                  isDisablePromoCode={!isEnablePromoCode}
                  product_type={ProductType.CAR}
                  isFormSubmitting={isLoading}
                />
              </div>
            </div>
          </div>
        </Form>
      </FormProvider>
      <div
        className={`fixed bottom-0 w-full bg-white px-2 ${isMobile ? 'px-2' : ''}`}
        style={{ zIndex: 100 }}
      >
        <PricingSummary
          loading={isLoading}
          isBasicDetailScreen={true}
          textButton='Generate Quote'
          handleBack={handleBackLogin}
          onClick={() => {
            form.submit();
          }}
          productType={ProductType.CAR}
        />
      </div>
      <QuoteModal
        onClick={() => setShowCSModal({ ...showCSModal, visible: false })}
        visible={showCSModal.visible}
        description={showCSModal.description}
      />
      <UnMatchVehicleModal
        vehicleNumber={vehicleNumber}
        onClose={() => setShowUnMatchModal(false)}
        visible={showUnMatchModal}
      />
    </>
  );
};

export default SingpassPolicyDetailForm;
