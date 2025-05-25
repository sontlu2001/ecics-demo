'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Spin } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { formatPromoCode } from '@/libs/utils/utils';

import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownField,
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import { MOTOR_QUOTE } from '@/constants';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';

import { UnableQuote } from './modal/UnableQuote';
import {
  DRV_EXP_OPTIONS,
  NCD_OPTIONS,
  NO_CLAIM_OPTIONS,
  NumberClaim,
  NumberDriverExperience,
  REG_YEAR_OPTIONS,
} from './options';
import { PromoCodeField } from '../components/PromoCode';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const sryMsg =
  'Please contact us for assistance at +65 6206 5588 or customerservice@ecics.com.sg';

const singpassFlowFields = {
  [MOTOR_QUOTE.hire_purchase]: z.number({
    required_error: 'This field is required',
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
};

const nonSingpassFlowFields = {
  ...singpassFlowFields,
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
  }),
  [MOTOR_QUOTE.owner_drv_exp]: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .refine((val) => val !== NumberDriverExperience.LESS_THAN_2_YEARS, {
      message: sryMsg,
    }),
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
const createSchema = (isSingpassFlow: boolean) => {
  const baseSchema = z.object(
    isSingpassFlow ? singpassFlowFields : nonSingpassFlowFields,
  );

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
    );
};

const nonSingpassSchema = z.object(nonSingpassFlowFields);
const singpassSchema = z.object(singpassFlowFields);
type NonSingpassFlowFields = z.infer<typeof nonSingpassSchema>;
type SingpassFlowFields = z.infer<typeof singpassSchema>;
type FormData = NonSingpassFlowFields | SingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  hirePurchaseOptions: DropdownOption[];
  isSingpassFlow: boolean;
  isLoading?: boolean;
}

const PolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  hirePurchaseOptions,
  isSingpassFlow = false,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';
  const initPromoCode = initialValues?.[MOTOR_QUOTE.promo_code] ?? promoDefault;

  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setShowCSModal] = useState(false);
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
    formState: { errors },
  } = methods;

  // input field change
  const start_date = watch(MOTOR_QUOTE.start_date) as Date;
  const date_of_birth = watch(MOTOR_QUOTE.owner_dob) as Date;
  const hire_purchase = watch(MOTOR_QUOTE.hire_purchase);
  const no_claim = watch(MOTOR_QUOTE.owner_no_of_claims) as string;
  const drvExp = watch(MOTOR_QUOTE.owner_drv_exp) as string;
  const vehicle_make = watch(MOTOR_QUOTE.vehicle_make) as string;

  const { data: makeOptions } = useGetVehicleMakes();
  const vehicleMakeId = makeOptions?.find(
    (item: any) => item.name === vehicle_make,
  )?.id;

  const { data: modelOptions, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(vehicleMakeId as string);

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

  // to open Customer Service Modal - Unable to provide quote online
  useEffect(() => {
    if (drvExp === NumberDriverExperience.LESS_THAN_2_YEARS) {
      setShowCSModal(true);
    }
  }, [drvExp]);

  useEffect(() => {
    if (no_claim === NumberClaim.TWO_MANY_CLAIMS) {
      setShowCSModal(true);
    }
  }, [no_claim]);

  // Register onSave callback to collect current form values
  useEffect(() => {
    onSaveRegister(() => {
      const value = methods.getValues();
      let vehicle_info_selected;
      let personal_info;

      if (!isSingpassFlow) {
        vehicle_info_selected = {
          vehicle_make: value[MOTOR_QUOTE.vehicle_make],
          vehicle_model: value[MOTOR_QUOTE.vehicle_model],
          first_registered_year: value[MOTOR_QUOTE.reg_yyyy] as string,
        };

        personal_info = {
          date_of_birth: dayjs(value[MOTOR_QUOTE.owner_dob] as Date).format(
            'DD/MM/YYYY',
          ),
          driving_experience: value[MOTOR_QUOTE.owner_drv_exp],
          phone: value[MOTOR_QUOTE.mobile],
          email: value[MOTOR_QUOTE.email],
        };
      }

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
    <div>
      <Form.Item
        name={MOTOR_QUOTE.hire_purchase}
        validateStatus={errors[MOTOR_QUOTE.hire_purchase] ? 'error' : ''}
        className='mb-1'
      >
        <LongOptionDropdownField
          name={MOTOR_QUOTE.hire_purchase}
          label='Vehicle Financed By'
          placeholder='Select name of finance company'
          options={hirePurchaseOptions}
          showSearch
        />
      </Form.Item>

      {hire_purchase === ID_OPTION_OTHER ? (
        <Form.Item
          name={MOTOR_QUOTE.other_hire_purchase}
          validateStatus={
            errors[MOTOR_QUOTE.other_hire_purchase] ? 'error' : ''
          }
          className='pt-1'
        >
          <InputField
            name={MOTOR_QUOTE.other_hire_purchase}
            placeholder='Please enter your hire purchase company'
          />
        </Form.Item>
      ) : null}
    </div>
  );

  const handleSubmit = (value: FormData) => {
    let vehicle_info_selected;
    let personal_info;

    if (!isSingpassFlow) {
      vehicle_info_selected = {
        vehicle_make: value[MOTOR_QUOTE.vehicle_make],
        vehicle_model: value[MOTOR_QUOTE.vehicle_model],
        first_registered_year: value[MOTOR_QUOTE.reg_yyyy] as string,
      };

      personal_info = {
        date_of_birth: dayjs(value[MOTOR_QUOTE.owner_dob] as Date).format(
          'DD/MM/YYYY',
        ),
        driving_experience: value[MOTOR_QUOTE.owner_drv_exp],
        phone: value[MOTOR_QUOTE.mobile],
        email: value[MOTOR_QUOTE.email],
      };
    }
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

  const minPolicyStartDate = useMemo(() => {
    const dobDayjs = dateToDayjs(date_of_birth);
    const minEligibleDate = adjustDateInDayjs(dobDayjs, 26, 0, 0);
    const today = dayjs();
    return today.isAfter(minEligibleDate) ? today : minEligibleDate;
  }, [date_of_birth]);
  const maxPolicyStartDate = useMemo(() => {
    const dobDayjs = dateToDayjs(date_of_birth);
    const maxEligibleDate = adjustDateInDayjs(dobDayjs, 71, 0, -1);
    const today = adjustDateInDayjs(dayjs(), 0, 0, 90);
    return today?.isBefore(maxEligibleDate) ? today : maxEligibleDate;
  }, [date_of_birth]);

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
            {!isSingpassFlow && (
              <>
                <div className='relative w-full' style={{ zIndex: '99' }}>
                  <div className='text-xl font-bold'>
                    Enter Your Policy Details
                  </div>
                  <div className='w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
                    <div className='my-3 text-lg font-bold'>
                      Personal Information
                    </div>
                    <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                      <Form.Item
                        name={MOTOR_QUOTE.email}
                        validateStatus={
                          errors[MOTOR_QUOTE.email] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MOTOR_QUOTE.email}
                          label='Email ID'
                          placeholder='Enter your email address'
                        />
                      </Form.Item>

                      <Form.Item
                        name={MOTOR_QUOTE.mobile}
                        validateStatus={
                          errors[MOTOR_QUOTE.mobile] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MOTOR_QUOTE.mobile}
                          label='Phone Number'
                          placeholder='Enter your phone number'
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
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
                          minDate={adjustDateInDayjs(dayjs(), -71, 0, 1)}
                          maxDate={adjustDateInDayjs(dayjs(), -26, 0, 0)}
                          onChange={handleChangeDob}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MOTOR_QUOTE.owner_drv_exp}
                        validateStatus={
                          errors[MOTOR_QUOTE.owner_drv_exp] ? 'error' : ''
                        }
                      >
                        <DropdownField
                          name={MOTOR_QUOTE.owner_drv_exp}
                          label='Years of Driving Experience'
                          placeholder="Select your driver's experience (Years)"
                          options={DRV_EXP_OPTIONS}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className='my-6 w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
                    <div className='my-3 text-lg font-bold'>
                      Vehicle Information
                    </div>
                    <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                      <Form.Item name={MOTOR_QUOTE.vehicle_make}>
                        <LongOptionDropdownField
                          name={MOTOR_QUOTE.vehicle_make}
                          label='Vehicle Make'
                          placeholder='Select vehicle make'
                          options={makeOptionsFormatted}
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
                          placeholder='Select registration year'
                          options={REG_YEAR_OPTIONS}
                        />
                      </Form.Item>

                      {!isSingpassFlow ? hire_purchase_section : null}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
              <div className='my-3 text-lg font-bold'>
                Confirm Your Policy Details
              </div>
              <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                <Form.Item
                  name={MOTOR_QUOTE.start_date}
                  validateStatus={errors[MOTOR_QUOTE.start_date] ? 'error' : ''}
                >
                  <DatePickerField
                    name={MOTOR_QUOTE.start_date}
                    label='Policy Start Date'
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
                    minDate={minPolicyEndDate}
                    maxDate={maxPolicyEndDate}
                    disabled={!start_date || isLoading}
                  />
                </Form.Item>

                <Form.Item name={MOTOR_QUOTE.owner_ncd}>
                  <DropdownField
                    name={MOTOR_QUOTE.owner_ncd}
                    label='No Claim Discount'
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
                    placeholder='Select number of claims'
                    options={NO_CLAIM_OPTIONS}
                  />
                </Form.Item>

                {isSingpassFlow ? hire_purchase_section : null}
              </div>
            </div>

            <div className='mt-6 w-full justify-items-center'>
              <div className='w-[90vw] md:w-96'>
                <PromoCodeField
                  placeholder='Enter promo code'
                  applyPromoCode={applyPromoCode}
                  setApplyPromoCode={setApplyPromoCode}
                  isDisablePromoCode={!isEnablePromoCode}
                />
              </div>
            </div>
          </div>
        </Form>
      </FormProvider>
      {/* <div className='fixed bottom-0 mt-6 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3'>
        <div className='w-full sm:col-span-1 sm:col-start-2'>
          <Form.Item>
            <PrimaryButton
              loading={isLoading}
              className='w-full'
              onClick={() => {
                form.submit();
              }}
            >
              Generate Quote
            </PrimaryButton>
          </Form.Item>
        </div>
      </div> */}
      <div className='fixed bottom-0 w-full bg-white' style={{ zIndex: 100 }}>
        <div className='flex w-full justify-center py-3'>
          <PrimaryButton
            loading={isLoading}
            className='w-[90vw] md:w-96'
            onClick={() => {
              form.submit();
            }}
          >
            Generate Quote
          </PrimaryButton>
        </div>
      </div>
      <UnableQuote
        onClick={() => setShowCSModal(false)}
        visible={showCSModal}
      />
    </>
  );
};

export default PolicyDetailForm;
