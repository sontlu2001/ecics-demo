'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { formatPromoCode } from '@/libs/utils/utils';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';
import { RadioField } from '@/components/ui/form/radiofield';

import { QuoteModal } from '@/app/motor/insurance/basic-detail/modal/QuoteModal';
import {
  HELPER_TYPE_OPTIONS,
  HelperTypeValue,
  NumberClaim,
  POLICY_DURATION_OPTIONS,
  PolicyDurationValue,
  ProductType,
} from '@/app/motor/insurance/basic-detail/options';
import { PromoCodeField } from '@/app/motor/insurance/components/PromoCode';
import { MAID_QUOTE } from '@/constants';
import { GROUP_COUNTRY } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useGetNationality } from '@/hook/insurance/common';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import ModalImportant from '@/components/page/insurance/complete-purchase/ModalImportant';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const singpassFlowFields = {
  [MAID_QUOTE.start_date]: z
    .date({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .refine(
      (date) => {
        const todayPlus5 = dayjs().add(5, 'day').startOf('day');
        return dayjs(date).isSameOrAfter(todayPlus5, 'day');
      },
      {
        message: 'Start date must be at least 5 days from today',
      },
    ),
  [MAID_QUOTE.end_date]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MAID_QUOTE.promo_code]: z.string().optional(),
  [MAID_QUOTE.nationality]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MAID_QUOTE.maid_dob]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MAID_QUOTE.maid_type]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),

  [MAID_QUOTE.plan_period]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
};

const nonSingpassFlowFields = {
  ...singpassFlowFields,
  [MAID_QUOTE.email]: z
    .string({
      required_error: 'This field is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  [MAID_QUOTE.mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  [MAID_QUOTE.maid_dob]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MAID_QUOTE.maid_type]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),

  [MAID_QUOTE.plan_period]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),

  [MAID_QUOTE.nationality]: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
};

const createSchema = (isSingpassFlow: boolean) => {
  const baseSchema = z.object(
    isSingpassFlow ? singpassFlowFields : nonSingpassFlowFields,
  );
  return baseSchema;
};

const nonSingpassSchema = z.object(nonSingpassFlowFields);
const singpassSchema = z.object(singpassFlowFields);
type NonSingpassFlowFields = z.infer<typeof nonSingpassSchema>;
type SingpassFlowFields = z.infer<typeof singpassSchema>;
type FormData = NonSingpassFlowFields | SingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  isSingpassFlow: boolean;
  isLoading?: boolean;
}

const PolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  isSingpassFlow = false,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const router = useRouterWithQuery();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';
  const initPromoCode = initialValues?.[MAID_QUOTE.promo_code] ?? promoDefault;
  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setShowCSModal] = useState<{
    visible: boolean;
    description: string;
  }>({
    visible: false,
    description: '',
  });
  const [descriptionQuote, setDescriptionQuote] = useState('');
  const [applyPromoCode, setApplyPromoCode] = useState(initPromoCode);
  const [isQuoteModalVisible, setIsQuoteModalVisible] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initialValues,
  });

  const {
    watch,
    formState: { errors, isDirty },
  } = methods;
  // input field change
  const start_date = watch(MAID_QUOTE.start_date) as Date;
  const maid_dob = watch(MAID_QUOTE.maid_dob) as Date;
  const no_claim = watch(MAID_QUOTE.owner_no_of_claims) as string;
  const nationality = watch(MAID_QUOTE.nationality) as string;
  const helperType = watch(MAID_QUOTE.maid_type) as string;
  const policyDuration = watch(MAID_QUOTE.plan_period) as string;
  const { data: nationalOptions } = useGetNationality(
    GROUP_COUNTRY.country_for_maid,
  );
  const nationalOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!nationalOptions) return [];
    return nationalOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [nationalOptions]);

  const planPeriodText =
    POLICY_DURATION_OPTIONS.find((opt) => opt.value === policyDuration)?.text ||
    policyDuration;

  const isEnablePromoCode = no_claim === NumberClaim.NEVER || !no_claim;

  const minDob = useMemo(() => dayjs().subtract(100, 'year'), []);
  const maxDob = useMemo(() => dayjs(), []);

  const minPolicyStartDate = useMemo(() => {
    return dayjs().add(5, 'day');
  }, []);

  const maxPolicyStartDate = useMemo(() => {
    return dayjs().add(26, 'month');
  }, []);

  useEffect(() => {
    if (helperType === HelperTypeValue.NEW_MAID) {
      methods.setValue(MAID_QUOTE.plan_period, PolicyDurationValue.TWENTY_SIX, {
        shouldValidate: true,
      });
    }
  }, [helperType, methods]);

  useEffect(() => {
    setApplyPromoCode(initPromoCode);
  }, [initPromoCode]);

  useEffect(() => {
    onSaveRegister(() => {
      const value = methods.getValues();
      let vehicle_info_selected;
      let personal_info;

      if (!isSingpassFlow) {
        vehicle_info_selected = {
          vehicle_make: value[MAID_QUOTE.vehicle_make],
          vehicle_model: value[MAID_QUOTE.vehicle_model],
          first_registered_year: value[MAID_QUOTE.reg_yyyy] as string,
        };
        personal_info = {
          date_of_birth: dayjs(value[MAID_QUOTE.owner_dob] as Date).format(
            'DD/MM/YYYY',
          ),
          phone: value[MAID_QUOTE.mobile],
          email: (value[MAID_QUOTE.email] as string)?.toLowerCase(),
        };
      }
      const payload = {
        key: key,
        maid_type: helperType,
        plan_period: planPeriodText,
        start_date: dayjs(value[MAID_QUOTE.start_date] as Date).format(
          'DD/MM/YYYY',
        ),
        partner_code: partnerCode,
        promo_code: applyPromoCode,
        personal_info: personal_info,
        maid_info: {
          nationality: nationality,
          date_of_birth: dayjs(maid_dob).format('DD/MM/YYYY'),
        },
      };
      return payload;
    });
  }, [methods, onSaveRegister]);

  useEffect(() => {
    if (!start_date || !policyDuration) return;
    const months = Number(policyDuration);
    const endDate = dayjs(start_date).add(months, 'month').toDate();
    methods.setValue(MAID_QUOTE.end_date, endDate, { shouldValidate: true });
  }, [start_date, policyDuration, methods]);

  useEffect(() => {
    if (!start_date || !maid_dob) return;

    const policyStartDate = dayjs(start_date);
    const dob = dayjs(maid_dob);
    const ageAtPolicyStart = policyStartDate.diff(dob, 'year');
    const isOutOfRange = ageAtPolicyStart < 23 || ageAtPolicyStart >= 60;

    if (isOutOfRange) {
      setShowCSModal({
        visible: true,
        description:
          ageAtPolicyStart < 23
            ? "The helper's age is below 23 years old."
            : "The helper's age is above 60 years old.",
      });
      methods.setValue(MAID_QUOTE.maid_dob, undefined, {
        shouldValidate: true,
      });
    }
  }, [start_date, maid_dob]);

  const handleChangeStartDate = (date: any) => {
    const startDate = dateToDayjs(date?.toDate());
    const defaultEndDate = adjustDateInDayjs(startDate, 1, 0, -1);
    if (!defaultEndDate) {
      methods.setValue(MAID_QUOTE.end_date, null as any);
      return;
    }
    methods.setValue(MAID_QUOTE.end_date, defaultEndDate.toDate());
    methods.trigger([MAID_QUOTE.end_date], { shouldFocus: false });
  };

  const handleSubmit = (value: FormData) => {
    if (!isDirty) {
      router.push(ROUTES.INSURANCE_MAID.PLAN);
      return;
    }
    let personal_info;
    const planPeriodText =
      POLICY_DURATION_OPTIONS.find((opt) => opt.value === policyDuration)
        ?.text || policyDuration;
    if (!isSingpassFlow) {
      personal_info = {
        phone: value[MAID_QUOTE.mobile],
        email: (value[MAID_QUOTE.email] as string)?.toLowerCase(),
      };
    }

    const payload = {
      key: key,
      maid_type: helperType,
      plan_period: planPeriodText,
      start_date: dayjs(value[MAID_QUOTE.start_date] as Date).format(
        'DD/MM/YYYY',
      ),
      partner_code: partnerCode,
      promo_code: applyPromoCode.toUpperCase() ?? '',
      personal_info: personal_info,
      maid_info: {
        nationality: nationality,
        date_of_birth: dayjs(maid_dob).format('DD/MM/YYYY'),
      },
    };
    onSubmit(payload);
  };

  const handleBackLogin = () => {
    if (isSingpassFlow) {
      router.push(ROUTES.MAID.REVIEW_INFO_DETAIL);
      return;
    }
    router.push(ROUTES.MAID.LOGIN);
  };

  return (
    <>
      <div className='flex w-full justify-center'>
        <FormProvider {...methods}>
          <Form
            form={form}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
            }}
            onFinish={methods.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className='mb-2 flex w-full max-w-[1200px] flex-col px-4 sm:px-4 md:mb-16 md:px-6 lg:px-0'
            {...props}
          >
            <div className='w-full'>
              <div className='relative w-full' style={{ zIndex: '99' }}>
                {!isSingpassFlow && (
                  <div className='flex flex-col gap-3'>
                    <div className='text-base font-bold underline decoration-gray-400'>
                      Contact Info
                    </div>
                    <div className='mb-4 grid w-full grid-cols-1 gap-4 md:mb-8 md:grid-cols-3 md:gap-6'>
                      <Form.Item
                        name={MAID_QUOTE.email}
                        validateStatus={errors[MAID_QUOTE.email] ? 'error' : ''}
                      >
                        <InputField
                          name={MAID_QUOTE.email}
                          label='Email Address'
                          placeholder='Enter Your Email Address'
                          isRequired={true}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MAID_QUOTE.mobile}
                        validateStatus={
                          errors[MAID_QUOTE.mobile] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MAID_QUOTE.mobile}
                          label='Mobile Number'
                          placeholder='Enter Your Mobile Number'
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            methods.setValue(MAID_QUOTE.mobile, onlyNums, {
                              shouldValidate: true,
                            });
                          }}
                          value={String(watch(MAID_QUOTE.mobile) ?? '')}
                          isRequired={true}
                        />
                      </Form.Item>
                      <div></div>
                    </div>
                  </div>
                )}
                <div className='flex flex-col gap-3'>
                  <div className='text-base font-bold underline decoration-gray-400'>
                    {isSingpassFlow
                      ? 'Helper’s Information'
                      : 'Basic Information'}
                  </div>
                  <div className='grid grid-cols-1 gap-6 gap-y-4 md:grid-cols-3'>
                    <Form.Item
                      name={MAID_QUOTE.maid_type}
                      validateStatus={
                        errors[MAID_QUOTE.maid_type] ? 'error' : ''
                      }
                    >
                      <RadioField
                        name={MAID_QUOTE.maid_type}
                        label='Helper Type'
                        options={HELPER_TYPE_OPTIONS}
                        className='flex w-full !flex-col'
                        isRequired={true}
                      />
                    </Form.Item>

                    <Form.Item
                      name={MAID_QUOTE.plan_period}
                      validateStatus={
                        errors[MAID_QUOTE.plan_period] ? 'error' : ''
                      }
                    >
                      <RadioField
                        name={MAID_QUOTE.plan_period}
                        label='Policy Duration'
                        options={
                          helperType === HelperTypeValue.NEW_MAID
                            ? POLICY_DURATION_OPTIONS.filter(
                                (opt) =>
                                  opt.value === PolicyDurationValue.TWENTY_SIX,
                              )
                            : POLICY_DURATION_OPTIONS
                        }
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </Form.Item>

                    <Form.Item
                      name={MAID_QUOTE.start_date}
                      validateStatus={
                        errors[MAID_QUOTE.start_date] ? 'error' : ''
                      }
                    >
                      <DatePickerField
                        name={MAID_QUOTE.start_date}
                        label='Policy Start Date'
                        minDate={minPolicyStartDate}
                        maxDate={maxPolicyStartDate}
                        onChange={handleChangeStartDate}
                        disabledDate={(current) => {
                          return current && current < dayjs().startOf('day');
                        }}
                        isRequired={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name={MAID_QUOTE.end_date}
                      validateStatus={
                        errors[MAID_QUOTE.end_date] ? 'error' : ''
                      }
                    >
                      <DatePickerField
                        label='Policy End Date'
                        name={MAID_QUOTE.end_date}
                        disabled
                        isRequired={true}
                      />
                    </Form.Item>

                    <Form.Item
                      name={MAID_QUOTE.nationality}
                      validateStatus={
                        errors[MAID_QUOTE.nationality] ? 'error' : ''
                      }
                    >
                      <LongOptionDropdownField
                        name={MAID_QUOTE.nationality}
                        label='Nationality'
                        placeholder='Select Helpers Nationality'
                        disabled={isLoading}
                        options={nationalOptionsFormatted}
                        onChange={() => {
                          // Reset model when make changes
                          methods.setValue(
                            MAID_QUOTE.vehicle_model,
                            null as any,
                          );
                        }}
                        showSearch
                        isRequired={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name={MAID_QUOTE.maid_dob}
                      validateStatus={
                        errors[MAID_QUOTE.maid_dob] ? 'error' : ''
                      }
                    >
                      <DatePickerField
                        name={MAID_QUOTE.maid_dob}
                        minDate={minDob}
                        maxDate={maxDob}
                        label='Date of birth'
                        isRequired={true}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className='mt-6 w-full justify-items-center'>
                <div className='w-[90vw] md:w-96'>
                  <PromoCodeField
                    placeholder='Enter promo code'
                    applyPromoCode={applyPromoCode}
                    setApplyPromoCode={setApplyPromoCode}
                    isDisablePromoCode={!isEnablePromoCode}
                    product_type={ProductType.MAID}
                    isFormSubmitting={isLoading}
                  />
                </div>
              </div>
            </div>
          </Form>
        </FormProvider>
        <QuoteModal
          onClick={() => setShowCSModal({ ...showCSModal, visible: false })}
          visible={showCSModal.visible}
          description={showCSModal.description}
        />
      </div>

      <div
        className={`fixed bottom-0 w-full border-[1px] border-gray-100 bg-white px-2 shadow-md shadow-gray-200`}
        style={{ zIndex: 100 }}
      >
        <div className='mx-auto w-full max-w-[1200px]'>
          <div className='flex w-full items-center justify-between py-3 md:py-6'>
            <Button
              color='cyan'
              icon={<ArrowBackIcon size={16} />}
              shape='circle'
              className='border-none bg-gray-200 pt-[6px]'
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                isSingpassFlow
                  ? setIsQuoteModalVisible(true)
                  : handleBackLogin?.();
              }}
            />
            <PrimaryButton
              loading={isLoading}
              className='ml-[6px] w-[90vw] bg-green-promo md:w-40'
              onClick={() => {
                form.submit();
              }}
            >
              Generate Quote
            </PrimaryButton>
          </div>
        </div>
        <ModalImportant
          isShowPopupImportant={isQuoteModalVisible}
          setIsShowPopupImportant={setIsQuoteModalVisible}
          handleRedirect={() => {
            handleBackLogin?.();
          }}
        />
      </div>
    </>
  );
};

export default PolicyDetailForm;
