'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Spin } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { calculateAge, formatPromoCode } from '@/libs/utils/utils';

import { PricingSummary } from '@/components/page/FeeBar';
import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownField,
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { InputNumberField } from '@/components/ui/form/inputnumberfield';

import { MAID_QUOTE, MOTOR_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { QuoteModal } from './modal/QuoteModal';
import {
  NCD_OPTIONS,
  NO_CLAIM_OPTIONS,
  NumberClaim,
  NumberDriverExperience,
  ProductType,
  REG_YEAR_OPTIONS,
} from './options';
import { PromoCodeField } from '../components/PromoCode';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const sryMsg =
  'Please contact us for assistance at +65 6206 5588 or customerservice@ecics.com.sg';

const nonSingpassFlowFields = {
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
  [MOTOR_QUOTE.promo_code]: z.string().optional(),
  [MOTOR_QUOTE.email]: z
    .string({
      required_error: 'This field is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  [MOTOR_QUOTE.mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  [MOTOR_QUOTE.owner_dob]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTOR_QUOTE.owner_drv_exp]: z.coerce
    .number({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .min(2, { message: sryMsg }),
  [MOTOR_QUOTE.vehicle_make]: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTOR_QUOTE.vehicle_model]: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTOR_QUOTE.reg_yyyy]: z.string({
    required_error: 'This field is required',
  }),
};

const ID_OPTION_OTHER = 2; //-- Others (Not Available in this list) --
const createSchema = () => {
  const baseSchema = z.object(nonSingpassFlowFields);

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

      // driver experience validation based on age at policy start date
      if (
        data[MOTOR_QUOTE.owner_dob] &&
        data[MOTOR_QUOTE.owner_drv_exp] &&
        data[MOTOR_QUOTE.start_date]
      ) {
        const age = calculateAge(
          data[MOTOR_QUOTE.owner_dob] as string,
          data[MOTOR_QUOTE.start_date] as Date,
        );
        const drvExp = Number(data[MOTOR_QUOTE.owner_drv_exp]);
        const maxDrvExp = age - 18;

        if (drvExp > maxDrvExp) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please provide driving experience suitable for the driver's age.",
            path: [MOTOR_QUOTE.owner_drv_exp],
          });
        }
      }
    });
};

const nonSingpassSchema = z.object(nonSingpassFlowFields);
type NonSingpassFlowFields = z.infer<typeof nonSingpassSchema>;
type FormData = NonSingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  hirePurchaseOptions: DropdownOption[];
  isLoading?: boolean;
}

const PolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  hirePurchaseOptions,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';
  const initPromoCode = initialValues?.[MOTOR_QUOTE.promo_code] ?? promoDefault;

  const schema = useMemo(() => createSchema(), []);
  const [showCSModal, setShowCSModal] = useState<{
    visible: boolean;
    description: string;
  }>({
    visible: false,
    description: '',
  });
  const [applyPromoCode, setApplyPromoCode] = useState(initPromoCode);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initialValues,
  });

  const {
    watch,
    formState: { errors, touchedFields },
  } = methods;

  // input field change
  const start_date = watch(MOTOR_QUOTE.start_date) as Date;
  const date_of_birth = watch(MOTOR_QUOTE.owner_dob) as Date;
  const hire_purchase = watch(MOTOR_QUOTE.hire_purchase);
  const no_claim = watch(MOTOR_QUOTE.owner_no_of_claims) as string;
  const drvExp = watch(MOTOR_QUOTE.owner_drv_exp) as number;
  const vehicle_make = watch(MOTOR_QUOTE.vehicle_make) as string;

  const { data: makeOptions } = useGetVehicleMakes();
  const vehicleMakeId = makeOptions?.find(
    (item: any) => item.name === vehicle_make,
  )?.id;

  const { data: modelOptions, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(vehicleMakeId as string);

  const handleBackLogin = () => {
    router.push(ROUTES.MOTOR.LOGIN);
  };

  const makeOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!makeOptions) return [];
    return makeOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [makeOptions]);

  const modelOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!modelOptions) return [];
    return modelOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [modelOptions]);

  useEffect(() => {
    setApplyPromoCode(initPromoCode);
  }, [initPromoCode]);

  useEffect(() => {
    if (hire_purchase !== ID_OPTION_OTHER) {
      methods.setValue(MOTOR_QUOTE.other_hire_purchase, '');
    }
  }, [hire_purchase]);

  // to open Customer Service Modal - Unable to provide quote online
  useEffect(() => {
    if (
      touchedFields[MOTOR_QUOTE.owner_drv_exp] &&
      drvExp !== null &&
      drvExp < NumberDriverExperience.LESS_THAN_2_YEARS
    ) {
      setShowCSModal({
        visible: true,
        description:
          'The listed driver has less than 2 years of driving experience',
      });
    }
  }, [drvExp, touchedFields[MOTOR_QUOTE.owner_drv_exp]]);

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
        vehicle_make: value[MOTOR_QUOTE.vehicle_make],
        vehicle_model: value[MOTOR_QUOTE.vehicle_model],
        first_registered_year: value[MOTOR_QUOTE.reg_yyyy] as string,
      };

      const personal_info = {
        date_of_birth: dayjs(value[MOTOR_QUOTE.owner_dob] as Date).format(
          'DD/MM/YYYY',
        ),
        driving_experience: value[MOTOR_QUOTE.owner_drv_exp],
        phone: value[MOTOR_QUOTE.mobile],
        email: (value[MAID_QUOTE.email] as string)?.toLowerCase(),
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

  const handleChangeDob = () => {
    methods.setValue(MOTOR_QUOTE.start_date, null as any);
    methods.setValue(MOTOR_QUOTE.end_date, null as any);
  };

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
          disabled={isLoading}
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
      vehicle_make: value[MOTOR_QUOTE.vehicle_make],
      vehicle_model: value[MOTOR_QUOTE.vehicle_model],
      first_registered_year: value[MOTOR_QUOTE.reg_yyyy] as string,
    };

    const personal_info = {
      date_of_birth: dayjs(value[MOTOR_QUOTE.owner_dob] as Date).format(
        'DD/MM/YYYY',
      ),
      driving_experience: value[MOTOR_QUOTE.owner_drv_exp],
      phone: value[MOTOR_QUOTE.mobile],
      email: value[MOTOR_QUOTE.email],
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

  const minDob = useMemo(() => dayjs().subtract(100, 'year'), []);
  const maxDob = useMemo(() => dayjs(), []);
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
            <div className='relative w-full' style={{ zIndex: '99' }}>
              <div className='w-full'>
                <div className='my-3 text-lg font-bold'>
                  Personal Information
                </div>
                <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                  <Form.Item
                    name={MOTOR_QUOTE.email}
                    validateStatus={errors[MOTOR_QUOTE.email] ? 'error' : ''}
                  >
                    <InputField
                      name={MOTOR_QUOTE.email}
                      label='Email Address'
                      isRequired
                      placeholder='Enter your email address'
                    />
                  </Form.Item>

                  <Form.Item
                    name={MOTOR_QUOTE.mobile}
                    validateStatus={errors[MOTOR_QUOTE.mobile] ? 'error' : ''}
                  >
                    <InputField
                      name={MOTOR_QUOTE.mobile}
                      label='Mobile Number'
                      isRequired
                      placeholder='Enter your phone number'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const onlyNums = e.target.value.replace(/\D/g, '');
                        methods.setValue(MOTOR_QUOTE.mobile, onlyNums, {
                          shouldValidate: true,
                        });
                      }}
                      value={String(watch(MOTOR_QUOTE.mobile) ?? '')}
                    />
                  </Form.Item>

                  <Form.Item
                    name={MOTOR_QUOTE.owner_dob}
                    validateStatus={
                      errors[MOTOR_QUOTE.owner_dob] ? 'error' : ''
                    }
                  >
                    <DatePickerField
                      name={MOTOR_QUOTE.owner_dob}
                      label='Date of birth'
                      minDate={minDob}
                      maxDate={maxDob}
                      isRequired
                      onChange={handleChangeDob}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className='my-6 mt-[32px] w-full'>
                <div className='my-3 text-lg font-bold'>
                  Vehicle Information
                </div>
                <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                  <Form.Item name={MOTOR_QUOTE.vehicle_make}>
                    <LongOptionDropdownField
                      name={MOTOR_QUOTE.vehicle_make}
                      label='Vehicle Make'
                      isRequired
                      placeholder='Select vehicle make'
                      options={makeOptionsFormatted}
                      disabled={isLoading}
                      onChange={() => {
                        // Reset model when make changes
                        methods.setValue(
                          MOTOR_QUOTE.vehicle_model,
                          null as any,
                        );
                      }}
                      showSearch
                    />
                  </Form.Item>

                  <Form.Item name={MOTOR_QUOTE.vehicle_model}>
                    <LongOptionDropdownField
                      name={MOTOR_QUOTE.vehicle_model}
                      label='Vehicle Model'
                      isRequired
                      placeholder='Select vehicle model'
                      options={modelOptionsFormatted}
                      disabled={!vehicle_make || isLoading}
                      notFoundContent={
                        isLoadingModelOptions ? (
                          <Spin size='small' />
                        ) : (
                          'No results found'
                        )
                      }
                      showSearch
                    />
                  </Form.Item>

                  <Form.Item name={MOTOR_QUOTE.reg_yyyy}>
                    <DropdownField
                      name={MOTOR_QUOTE.reg_yyyy}
                      label="Vehicle's Year of Registration"
                      isRequired
                      placeholder='Select registration year'
                      options={REG_YEAR_OPTIONS}
                    />
                  </Form.Item>
                  {hire_purchase_section}
                </div>
              </div>
            </div>

            <div className='mt-[32px] w-full'>
              <div className='my-3 text-lg font-bold'>
                Your Driving Experience
              </div>
              <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                <Form.Item
                  name={MOTOR_QUOTE.owner_drv_exp}
                  validateStatus={
                    errors[MOTOR_QUOTE.owner_drv_exp] ? 'error' : ''
                  }
                >
                  <InputNumberField
                    name={MOTOR_QUOTE.owner_drv_exp}
                    label='Years of Driving Experience'
                    isRequired
                    placeholder='Enter your driving experience'
                    min={0}
                    max={60}
                    suffix='year(s)'
                    precision={0}
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
              </div>
            </div>

            <div className='mt-[32px] w-full'>
              <div className='my-3 text-lg font-bold'>
                Policy Start & End Date
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
    </>
  );
};

export default PolicyDetailForm;
