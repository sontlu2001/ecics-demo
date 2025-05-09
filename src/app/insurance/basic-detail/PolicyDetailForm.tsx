'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import {
  adjustDateInDate,
  adjustDateInDayjs,
  dateToDayjs,
} from '@/libs/utils/date-utils';
import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui//form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import RadioField from '@/components/ui//form/radiofield';
import { PromoCodeField, PromoCodeModel } from '../components/PromoCode';
import { PrimaryButton } from '@/components/ui/buttons';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UnableQuote } from './modal/UnableQuote';
import { MOTOR_QUOTE } from '@/constants';
import {
  CLAIM_AMOUNT_OPTIONS,
  DEFAULT_PROMO_CODE,
  DRV_EXP_OPTIONS,
  NCD_OPTIONS,
  NO_CLAIM_OPTIONS,
  REG_YEAR_OPTIONS,
} from './options';
import { v4 as uuidv4 } from 'uuid';

const sryMsg = 'Sorry, we cannot provide you a quotation online';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[89]\d{7}$/;
const defaultValues = {
  [MOTOR_QUOTE.quick_proposal_start_date]: new Date(),
  [MOTOR_QUOTE.quick_proposal_end_date]: adjustDateInDate(new Date(), 1, 0, -1),
  [MOTOR_QUOTE.quick_quote_owner_ncd]: 40,
};

const singpassFlowFields = {
  [MOTOR_QUOTE.quick_proposal_hire_purchase]: z.number({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_proposal_other_hire_purchase]: z.string().optional(),
  [MOTOR_QUOTE.quick_proposal_start_date]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_proposal_end_date]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_quote_owner_ncd]: z.number({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_quote_owner_no_of_claims]: z
    .number({
      required_error: 'This field is required',
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) < 2, {
      message: sryMsg,
    }),
  [MOTOR_QUOTE.quick_quote_owner_claim_amount]: z.string().optional(),
  [MOTOR_QUOTE.quick_proposal_promo_code]: z.string().optional(),
};

const nonSingpassFlowFields = {
  ...singpassFlowFields,
  [MOTOR_QUOTE.quick_quote_email]: z
    .string({
      required_error: 'This field is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  [MOTOR_QUOTE.quick_quote_mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  [MOTOR_QUOTE.quick_quote_owner_dob]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_quote_owner_drv_exp]: z
    .number({
      required_error: 'This field is required',
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2, {
      message: sryMsg,
    }),
  [MOTOR_QUOTE.quick_quote_make]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTOR_QUOTE.quick_quote_model]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTOR_QUOTE.quick_quote_reg_yyyy]: z.string({
    required_error: 'This field is required',
  }),
};

const createSchema = (isSingpassFlow: boolean) => {
  const baseSchema = z.object(
    isSingpassFlow ? singpassFlowFields : nonSingpassFlowFields,
  );

  return baseSchema
    .refine(
      (data) => {
        return !(
          data[MOTOR_QUOTE.quick_quote_owner_no_of_claims] === 1 &&
          !data[MOTOR_QUOTE.quick_quote_owner_claim_amount]
        );
      },
      {
        message: 'This field is required',
        path: [MOTOR_QUOTE.quick_quote_owner_claim_amount],
      },
    )
    .refine(
      (data) => {
        if (data[MOTOR_QUOTE.quick_quote_owner_claim_amount] === '>20000') {
          return false;
        }
        return true;
      },
      {
        message: sryMsg,
        path: [MOTOR_QUOTE.quick_quote_owner_claim_amount],
      },
    )
    .refine(
      (data) => {
        return !(
          data[MOTOR_QUOTE.quick_proposal_hire_purchase] === 0 &&
          !data[MOTOR_QUOTE.quick_proposal_other_hire_purchase]
        );
      },
      {
        message: 'This field is required',
        path: [MOTOR_QUOTE.quick_proposal_other_hire_purchase],
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
  hirePurchaseOptions: DropdownOption[];
  veh_make_model_list: DropdownOption[];
  isSingpassFlow: boolean;
  onSubmitPromoCode: (promoCode: string) => void;
  handleRemovePromoCode: () => void;
  errMsgPromoCode?: string;
  appliedPromoCode?: PromoCodeModel | null;
}

const PolicyDetailForm = ({
  onSubmit,
  veh_make_model_list,
  hirePurchaseOptions,
  isSingpassFlow = false,
  onSubmitPromoCode,
  handleRemovePromoCode,
  errMsgPromoCode,
  appliedPromoCode,
  initialValues,
  ...props
}: PolicyDetailProps) => {
  const [form] = Form.useForm();
  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setCSModal] = useState(false);
  const [isDisablePromoCode, setIsDisablePromoCode] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: defaultValues,
    values: initialValues || undefined,
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  // input field change
  const start_date = watch(MOTOR_QUOTE.quick_proposal_start_date) as Date;
  const hire_purchase = watch(MOTOR_QUOTE.quick_proposal_hire_purchase);
  const no_claim = watch(MOTOR_QUOTE.quick_quote_owner_no_of_claims) as number;
  const claimAmount = watch(MOTOR_QUOTE.quick_quote_owner_claim_amount);
  const drvExp = watch(MOTOR_QUOTE.quick_quote_owner_drv_exp) as number;

  // to open Customer Service Modal - Unable to provide quote online
  useEffect(() => {
    if (drvExp < 2) {
      setCSModal(true);
    }
  }, [drvExp]);

  useEffect(() => {
    if (no_claim > 0) {
      setIsDisablePromoCode(true);
      if (no_claim >= 2) {
        setCSModal(true);
      }
    } else {
      setIsDisablePromoCode(false);
    }
  }, [no_claim]);

  useEffect(() => {
    if (claimAmount === '>20000') {
      setCSModal(true);
    }
  }, [claimAmount]);

  // Error logging
  useEffect(() => {
    if (Object.keys(errors).length) {
      console.error('Current errors:', errors);
    }
  }, [errors]);

  const hire_purchase_section = (
    <div>
      <Form.Item
        name={MOTOR_QUOTE.quick_proposal_hire_purchase}
        validateStatus={
          errors[MOTOR_QUOTE.quick_proposal_hire_purchase] ? 'error' : ''
        }
        className='mb-1'
      >
        <DropdownField
          name={MOTOR_QUOTE.quick_proposal_hire_purchase}
          label='Vehicle Financed By'
          placeholder='Select name of finance company'
          options={hirePurchaseOptions}
          showSearch
        ></DropdownField>
      </Form.Item>

      {hire_purchase === 0 ? (
        <Form.Item
          name={MOTOR_QUOTE.quick_proposal_other_hire_purchase}
          validateStatus={
            errors[MOTOR_QUOTE.quick_proposal_other_hire_purchase]
              ? 'error'
              : ''
          }
        >
          <InputField
            name={MOTOR_QUOTE.quick_proposal_other_hire_purchase}
            placeholder='Please enter your hire purchase company'
          />
        </Form.Item>
      ) : null}
    </div>
  );

  const closeCSModal = () => {
    setCSModal(false);
  };

  const handleSubmit = (value: FormData) => {
    let vehicle_basic_details;
    let personal_info;
    if (!isSingpassFlow) {
      vehicle_basic_details = {
        make: value[MOTOR_QUOTE.quick_quote_make],
        model: value[MOTOR_QUOTE.quick_quote_model],
        first_registered_year: value[
          MOTOR_QUOTE.quick_quote_reg_yyyy
        ] as string,
        chasis_number: 'SBA123A', // to chg
      };

      personal_info = {
        date_of_birth: dayjs(
          value[MOTOR_QUOTE.quick_quote_owner_dob] as Date,
        ).format('DD/MM/YYYY'),
        driving_experience: value[MOTOR_QUOTE.quick_quote_owner_drv_exp],
        phone_number: value[MOTOR_QUOTE.quick_quote_mobile],
        email: value[MOTOR_QUOTE.quick_quote_email],
      };
    }

    const payload = {
      key: uuidv4(),
      partner_code: '',
      promo_code: isDisablePromoCode
        ? ''
        : appliedPromoCode
          ? appliedPromoCode.code
          : '',
      company_id: value[MOTOR_QUOTE.quick_proposal_hire_purchase],
      personal_info: personal_info,
      vehicle_basic_details: vehicle_basic_details,
      insurance_additional_info: {
        no_claim_discount: value[MOTOR_QUOTE.quick_quote_owner_ncd],
        no_of_claim: value[MOTOR_QUOTE.quick_quote_owner_no_of_claims],
        start_date: dayjs(
          value[MOTOR_QUOTE.quick_proposal_start_date] as Date,
        ).format('DD/MM/YYYY'),
        end_date: dayjs(
          value[MOTOR_QUOTE.quick_proposal_end_date] as Date,
        ).format('DD/MM/YYYY'),
        last_claim_amount: value[MOTOR_QUOTE.quick_quote_owner_claim_amount],
      },
    };
    onSubmit(payload);
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
          onFinish={methods.handleSubmit(handleSubmit)}
          className='w-full'
          {...props}
        >
          {/* Manual Flow detail */}
          {!isSingpassFlow ? (
            <>
              <div className='text-xl font-bold'>Enter Your Policy Details</div>
              <div className='w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
                <div className='my-3 text-lg font-bold'>
                  Personal Information
                </div>
                <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                  <Form.Item
                    name={MOTOR_QUOTE.quick_quote_email}
                    validateStatus={
                      errors[MOTOR_QUOTE.quick_quote_email] ? 'error' : ''
                    }
                  >
                    <InputField
                      name={MOTOR_QUOTE.quick_quote_email}
                      label='Email ID'
                      placeholder='Enter your email address'
                    />
                  </Form.Item>

                  <Form.Item
                    name={MOTOR_QUOTE.quick_quote_mobile}
                    validateStatus={
                      errors[MOTOR_QUOTE.quick_quote_mobile] ? 'error' : ''
                    }
                  >
                    <InputField
                      name={MOTOR_QUOTE.quick_quote_mobile}
                      label='Phone Number'
                      placeholder='Enter your phone number'
                    />
                  </Form.Item>

                  <Form.Item
                    name={MOTOR_QUOTE.quick_quote_owner_dob}
                    validateStatus={
                      errors[MOTOR_QUOTE.quick_quote_owner_dob] ? 'error' : ''
                    }
                  >
                    <DatePickerField
                      name={MOTOR_QUOTE.quick_quote_owner_dob}
                      label='Date of birth'
                      minDate={dayjs().startOf('day').subtract(70, 'years')}
                      maxDate={dayjs().startOf('day').subtract(25, 'years')}
                    />
                  </Form.Item>

                  <Form.Item
                    name={MOTOR_QUOTE.quick_quote_owner_drv_exp}
                    validateStatus={
                      errors[MOTOR_QUOTE.quick_quote_owner_drv_exp]
                        ? 'error'
                        : ''
                    }
                  >
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_owner_drv_exp}
                      label='Years of Driving Experience'
                      placeholder="Select your driver's experience (Years)"
                      options={DRV_EXP_OPTIONS}
                    ></DropdownField>
                  </Form.Item>
                </div>
              </div>

              <div className='my-6 w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
                <div className='my-3 text-lg font-bold'>
                  Vehicle Information
                </div>
                <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                  <Form.Item name={MOTOR_QUOTE.quick_quote_make}>
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_make}
                      label='Vehicle Make'
                      placeholder='Select vehicle make'
                      options={veh_make_model_list}
                      showSearch
                    ></DropdownField>
                  </Form.Item>

                  <Form.Item name={MOTOR_QUOTE.quick_quote_model}>
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_model}
                      label='Vehicle Model'
                      placeholder='Select vehicle model'
                      options={veh_make_model_list}
                      showSearch
                    ></DropdownField>
                  </Form.Item>

                  <Form.Item name={MOTOR_QUOTE.quick_quote_reg_yyyy}>
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_reg_yyyy}
                      label="Vehicle's Year of Registration"
                      placeholder='Select registration year'
                      options={REG_YEAR_OPTIONS}
                    ></DropdownField>
                  </Form.Item>

                  {!isSingpassFlow ? hire_purchase_section : null}
                </div>
              </div>
            </>
          ) : null}

          <div className='w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
            <div className='my-3 text-lg font-bold'>
              Confirm Your Policy Details
            </div>
            <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
              <Form.Item
                name={MOTOR_QUOTE.quick_proposal_start_date}
                validateStatus={
                  errors[MOTOR_QUOTE.quick_proposal_start_date] ? 'error' : ''
                }
              >
                <DatePickerField
                  name={MOTOR_QUOTE.quick_proposal_start_date}
                  label='Policy Start Date'
                  minDate={dayjs()}
                  maxDate={adjustDateInDayjs(dayjs(), 0, 3, 0)}
                />
              </Form.Item>

              <Form.Item
                name={MOTOR_QUOTE.quick_proposal_end_date}
                validateStatus={
                  errors[MOTOR_QUOTE.quick_proposal_end_date] ? 'error' : ''
                }
              >
                <DatePickerField
                  label='Policy End Date'
                  name={MOTOR_QUOTE.quick_proposal_end_date}
                  minDate={adjustDateInDayjs(
                    dateToDayjs(start_date),
                    0,
                    10,
                    -1,
                  )}
                  maxDate={adjustDateInDayjs(
                    dateToDayjs(start_date),
                    0,
                    18,
                    -1,
                  )}
                />
              </Form.Item>

              <Form.Item name={MOTOR_QUOTE.quick_quote_owner_ncd}>
                <DropdownField
                  name={MOTOR_QUOTE.quick_quote_owner_ncd}
                  label='No Claim Discount'
                  placeholder='Select your current NCD'
                  options={NCD_OPTIONS}
                ></DropdownField>
              </Form.Item>

              <Form.Item
                name={MOTOR_QUOTE.quick_quote_owner_no_of_claims}
                validateStatus={
                  errors[MOTOR_QUOTE.quick_quote_owner_no_of_claims]
                    ? 'error'
                    : ''
                }
              >
                <DropdownField
                  name={MOTOR_QUOTE.quick_quote_owner_no_of_claims}
                  label='Number of claims in the past 3 years'
                  placeholder='Select number of claims'
                  options={NO_CLAIM_OPTIONS}
                ></DropdownField>
              </Form.Item>

              {no_claim === 1 ? (
                <Form.Item
                  name={MOTOR_QUOTE.quick_quote_owner_claim_amount}
                  validateStatus={
                    errors[MOTOR_QUOTE.quick_quote_owner_claim_amount]
                      ? 'error'
                      : ''
                  }
                >
                  <RadioField
                    name={MOTOR_QUOTE.quick_quote_owner_claim_amount}
                    label='Last Claim Amount?'
                    options={CLAIM_AMOUNT_OPTIONS}
                  ></RadioField>
                </Form.Item>
              ) : null}

              {isSingpassFlow ? hire_purchase_section : null}
            </div>
          </div>

          <div className='mt-6 w-full justify-items-center'>
            <div className='-mx-3 sm:col-span-1 sm:col-start-2'>
              <PromoCodeField
                name={MOTOR_QUOTE.quick_proposal_promo_code}
                placeholder='Enter promo code'
                onCancel={handleRemovePromoCode}
                onSubmitPromoCode={onSubmitPromoCode}
                errorMessage={errMsgPromoCode}
                appliedPromoCode={appliedPromoCode}
                defaultPromoCode={DEFAULT_PROMO_CODE}
                isDisablePromoCode={isDisablePromoCode}
              />
            </div>
          </div>

          <div className='mt-6 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3'>
            <div className='w-full sm:col-span-1 sm:col-start-2'>
              <Form.Item>
                <PrimaryButton
                  htmlType='submit'
                  // disabled={!methods.formState.isValid}
                  loading={methods.formState.isSubmitting}
                  className='w-full'
                >
                  Generate Quote
                </PrimaryButton>
              </Form.Item>
            </div>
          </div>
        </Form>
      </FormProvider>
      <UnableQuote onClick={closeCSModal} visible={showCSModal} />
    </>
  );
};

export default PolicyDetailForm;
