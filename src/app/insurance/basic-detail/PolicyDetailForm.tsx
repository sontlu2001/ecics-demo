'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
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

const sryMsg = 'Sorry, we cannot provide you a quotation online';

const singpassFlowFields = {
  [MOTOR_QUOTE.quick_proposal_hire_purchase]: z.string({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_proposal_other_hire_purchase]: z.string().optional(),
  [MOTOR_QUOTE.quick_proposal_start_date]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_proposal_end_date]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_quote_owner_ncd]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
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
    .email('Invalid email format'),
  [MOTOR_QUOTE.quick_quote_mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .min(8, 'Invalid phone number'),
  [MOTOR_QUOTE.quick_quote_owner_dob]: z.date({
    required_error: 'This field is required',
  }),
  [MOTOR_QUOTE.quick_quote_owner_drv_exp]: z
    .string({
      required_error: 'This field is required',
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2, {
      message: sryMsg,
    }),
  [MOTOR_QUOTE.quick_quote_make_and_model]: z
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
        if (data[MOTOR_QUOTE.quick_quote_owner_claim_amount] === '>=20000') {
          return true;
        }
        return false;
      },
      {
        message: sryMsg,
        path: [MOTOR_QUOTE.quick_quote_owner_claim_amount],
      },
    )
    .refine(
      (data) => {
        return !(
          data[MOTOR_QUOTE.quick_proposal_hire_purchase] ===
            '-- Others (Not Available in this list) --' &&
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
  hire_purchase_list: string[];
  veh_make_model_list: DropdownOption[];
  isSingpassFlow: boolean;
  handleInputChange: (name: string, value: any) => void;
  handleRemovePromoCode: () => void;
  defaultPromoCode?: PromoCodeModel | null;
  appliedPromoCode?: PromoCodeModel | null;
}

const PolicyDetailForm = ({
  onSubmit,
  veh_make_model_list,
  hire_purchase_list,
  isSingpassFlow = false,
  handleInputChange,
  handleRemovePromoCode,
  defaultPromoCode,
  appliedPromoCode,
  initialValues,
  ...props
}: PolicyDetailProps) => {
  const [form] = Form.useForm();
  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setCSModal] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: initialValues,
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  // input field change
  const start_date = watch(MOTOR_QUOTE.quick_proposal_start_date) as Date;
  const hire_purchase = watch(MOTOR_QUOTE.quick_proposal_hire_purchase);
  const no_claim = watch(MOTOR_QUOTE.quick_quote_owner_no_of_claims);

  useEffect(() => {
    // Check if any critical fields have errors
    const criticalFields = [
      MOTOR_QUOTE.quick_quote_owner_no_of_claims,
      MOTOR_QUOTE.quick_quote_owner_drv_exp,
      MOTOR_QUOTE.quick_quote_owner_claim_amount,
    ];

    const hasCriticalError = criticalFields.some(
      (field) => errors[field]?.message === sryMsg,
    );

    setCSModal(hasCriticalError);

    // Optional: Log all errors (remove in production)
    if (Object.keys(errors).length) {
      console.error('Current errors:', errors);
    }
  }, [errors]);

  // Options for Dropdown
  const drvExpOptions: DropdownOption[] = [
    { value: '0', text: 'Less than 2 years' },
    { value: '2', text: '2 years' },
    { value: '3', text: '3 years' },
    { value: '4', text: '4 years' },
    { value: '5', text: '5 years' },
    { value: '6', text: '6 years and above' },
  ];

  const generateYearOptions = (): DropdownOption[] => {
    const currentYear = new Date().getFullYear();
    const years: DropdownOption[] = [];

    for (let year = currentYear; year >= currentYear - 20; year--) {
      years.push({
        value: year.toString(),
        text: year.toString(),
      });
    }

    return years;
  };

  const regYearOptions: DropdownOption[] = generateYearOptions();

  const ncdOptions: DropdownOption[] = [
    { value: '0%', text: '0%' },
    { value: '10%', text: '10%' },
    { value: '20%', text: '20%' },
    { value: '30%', text: '30%' },
    { value: '40%', text: '40%' },
    { value: '50%', text: '50%' },
  ];

  const noClaimOptions: DropdownOption[] = [
    { value: 0, text: '0' },
    { value: 1, text: '1' },
    { value: 2, text: '2 and above' },
  ];

  const claimsAmountOption: DropdownOption[] = [
    { value: '>=20000', text: 'less than SGD 20K' },
    { value: '<20000', text: 'more than SGD 20K' },
  ];

  const hirePurchaseOptions: DropdownOption[] = hire_purchase_list.map(
    (item) => ({
      value: item,
      text: item,
    }),
  );

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

      {hire_purchase === '-- Others (Not Available in this list) --' ? (
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
    console.log('to false');
  };

  const handleSubmit = (value: FormData) => {
    try {
      console.log('in pd click');
      console.log(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const showCSModal = error.issues.some(
          (issue) =>
            (issue.message === sryMsg &&
              issue.path.includes(MOTOR_QUOTE.quick_quote_owner_drv_exp)) ||
            issue.path.includes(MOTOR_QUOTE.quick_quote_owner_no_of_claims) ||
            issue.path.includes(MOTOR_QUOTE.quick_quote_owner_claim_amount),
        );

        if (showCSModal) {
          setCSModal(true);
        }
      }
    }
  };

  const handleSubmitPromoCode = (promoCode: string) => {
    console.log('promocode parent', promoCode);
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
                <div className='space-y-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0'>
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
                      options={drvExpOptions}
                    ></DropdownField>
                  </Form.Item>
                </div>
              </div>

              <div className='my-6 w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm'>
                <div className='my-3 text-lg font-semibold'>
                  Vehicle Information
                </div>
                <div className='space-y-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0'>
                  <Form.Item name={MOTOR_QUOTE.quick_quote_make_and_model}>
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_make_and_model}
                      label='Vehicle Make & Model'
                      placeholder='Select vehicle make and model'
                      options={veh_make_model_list}
                      showSearch
                    ></DropdownField>
                  </Form.Item>

                  <Form.Item name={MOTOR_QUOTE.quick_quote_reg_yyyy}>
                    <DropdownField
                      name={MOTOR_QUOTE.quick_quote_reg_yyyy}
                      label="Vehicle's Year of Registration"
                      placeholder='Select registration year'
                      options={regYearOptions}
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
            <div className='sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0'>
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
                  options={ncdOptions}
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
                  options={noClaimOptions}
                ></DropdownField>
              </Form.Item>

              {no_claim == '1' ? (
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
                    options={claimsAmountOption}
                  ></RadioField>
                </Form.Item>
              ) : null}

              {isSingpassFlow ? hire_purchase_section : null}
            </div>
          </div>

          <div className='mt-6 w-full justify-items-center'>
            <div className='-mx-3 sm:col-span-1 sm:col-start-2'>
              <PromoCodeField
                fieldKey={MOTOR_QUOTE.quick_proposal_promo_code}
                placeholder='Enter promo code'
                onCancel={handleRemovePromoCode}
                onSubmitPromoCode={handleSubmitPromoCode}
                appliedPromoCode={appliedPromoCode}
                defaultPromoCode={defaultPromoCode}
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
