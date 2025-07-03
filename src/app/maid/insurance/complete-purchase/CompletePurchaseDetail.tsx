'use client';

import { Drawer, Form, Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  formatCurrency,
  formatCurrencyString,
  saveToLocalStorage,
} from '@/libs/utils/utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';
import ReviewSection from '@/components/page/insurance/complete-purchase/ReviewSection';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import DeclarationConfirmModal from '@/app/maid/insurance/complete-purchase/modal/DeclarationConfirmModal';
import {
  HAS_HELPER_WORKED_OPTION,
  HasHelperValue,
  ProductType,
} from '@/app/motor/insurance/basic-detail/options';
import {
  MAID_PAYMENT_URL,
  VALUE_OPTION_COMPANY,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import {
  useGetHirePurchaseList,
  usePayment,
  useSaveProposal,
} from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MAID_QUOTE } from '@/constants';
import { z } from 'zod';
import { passportRegex } from '@/constants/validation.constant';
import { InputField } from '@/components/ui/form/inputfield';
import { REGEX_TEXT } from '@/app/api/utils/regex';
import { RadioField } from '@/components/ui/form/radiofield';
import {
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui/form/dropdownfield';
import { useSaveMaidQuote } from '@/hook/insurance/maidQuote';
import { finValidator } from '@/libs/utils/validation-utils';

export default function CompletePurchaseDetail({
  onSaveRegister,
  isSingPassFlow,
}: {
  onSaveRegister: (fn: () => any) => void;
  isSingPassFlow: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouterWithQuery();
  const [form] = Form.useForm();

  const schema = z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name is required',
        })
        .min(3, 'Name must be at least 3 characters')
        .max(60, 'Name must be at most 60 characters')
        .nonempty('Name is required'),
      [MAID_QUOTE.fin]: z
        .string({
          required_error: 'Fin is required',
          invalid_type_error: 'Fin is required',
        })
        .min(3, 'FIN must be at least 3 characters')
        .max(9, 'FIN must be at most 9 characters')
        .nonempty('Fin is required')
        .refine(finValidator, { message: 'Please enter a valid FIN.' }),
      [MAID_QUOTE.passport_number]: z
        .string({
          required_error: 'Passport number is required',
          invalid_type_error: 'Passport number is required',
        })
        .nonempty('Passport number is required')
        .min(6, 'Passport number must be at least 6 characters')
        .max(20, 'Passport number must be at most 20 characters')
        .regex(
          passportRegex,
          'Passport number must not contain special characters',
        ),
      [MAID_QUOTE.has_helper_worked_12_months]: z
        .string({
          required_error: 'Has the helper is required',
          invalid_type_error: 'Has the helper is required',
        })
        .nonempty('Has the helper is required'),

      [MAID_QUOTE.company_name]: z.string({
        required_error: 'Previous Insurer Name is required',
        invalid_type_error: 'Previous Insurer Name is required',
      }),

      [MAID_QUOTE.company_name_other]: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data[MAID_QUOTE.has_helper_worked_12_months] === HasHelperValue.YES) {
        if (!data[MAID_QUOTE.company_name]) {
          ctx.addIssue({
            path: [MAID_QUOTE.company_name],
            code: z.ZodIssueCode.custom,
            message: 'Previous Insurer Name is required',
          });
        }
        if (
          data[MAID_QUOTE.company_name] === VALUE_OPTION_COMPANY &&
          !data[MAID_QUOTE.company_name_other]
        ) {
          ctx.addIssue({
            path: [MAID_QUOTE.company_name_other],
            code: z.ZodIssueCode.custom,
            message: 'Other Insurer Name is required',
          });
        }
      }
      const fin = data[MAID_QUOTE.fin];
      const nric = maidQuote?.data?.personal_info?.nric;
      if (
        fin !== undefined &&
        nric !== undefined &&
        String(fin).trim() !== '' &&
        String(nric).trim() !== '' &&
        String(fin).toUpperCase() === String(nric).toUpperCase()
      ) {
        ctx.addIssue({
          path: [MAID_QUOTE.fin],
          code: z.ZodIssueCode.custom,
          message: 'FIN must not be the same as NRIC/FIN.',
        });
      }
    });

  type FormData = z.infer<typeof schema>;

  const { handleBack } = useInsurance();
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const maidQuote = useAppSelector((state) => state.maidQuote?.maidQuote);
  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.MAID);

  const isFinalized = useSelector(
    (state: any) => state.maidQuote.maidQuote?.is_finalized,
  );

  const hirePurchaseListFormatted: DropdownOption[] = [
    ...(Array.isArray(hirePurchaseList)
      ? hirePurchaseList.map((item: any) => ({
          value: String(item.id),
          text: item.name,
        }))
      : []),
  ];

  const companyOption = hirePurchaseListFormatted.find(
    (item) => item.text === maidQuote?.data?.maid_info?.company_name,
  );

  const companyId = companyOption ? String(companyOption.value) : '';

  const initFormDate: FormData = {
    name: maidQuote?.data?.maid_info?.name || '',
    [MAID_QUOTE.fin]: maidQuote?.data?.maid_info?.fin || '',
    [MAID_QUOTE.passport_number]:
      maidQuote?.data?.maid_info?.passport_number || '',
    [MAID_QUOTE.has_helper_worked_12_months]:
      maidQuote?.data?.maid_info?.has_helper_worked_12_months || '',
    [MAID_QUOTE.company_name]: companyId,
    [MAID_QUOTE.company_name_other]:
      maidQuote?.data?.maid_info?.company_name_other || '',
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initFormDate,
  });

  const {
    watch,
    setValue,
    formState: { errors, isDirty },
  } = methods;

  const {
    mutate: payment,
    data: dataPayment,
    isPending: isPendingPay,
  } = usePayment();
  const {
    mutateAsync: saveProposal,
    isSuccess,
    isPending: isPendingSave,
  } = useSaveProposal();
  const { mutateAsync: saveMaidQuote, isPending: isPendingSaveQuote } =
    useSaveMaidQuote();

  const selectedCompanyName = methods.watch(MAID_QUOTE.company_name);
  const selectedHasTheHelper = methods.watch(
    MAID_QUOTE.has_helper_worked_12_months,
  );

  useEffect(() => {
    if (selectedHasTheHelper === HasHelperValue.NO) {
      methods.setValue(MAID_QUOTE.company_name, '');
      methods.setValue(MAID_QUOTE.company_name_other, '');
    }
  }, [selectedHasTheHelper, methods]);

  useEffect(() => {
    if (selectedCompanyName !== VALUE_OPTION_COMPANY) {
      methods.setValue(MAID_QUOTE.company_name_other, '');
    }
  }, [selectedCompanyName, methods]);

  const handleEditClick = (key: string) => {
    toggleSection(key);
  };
  const routerBySectionKey = (key: string) => {
    if (['helper_basic_information', 'policy', 'personal'].includes(key)) {
      return ROUTES.INSURANCE_MAID.BASIC_DETAIL;
    }
    if (['helper_details', 'owner'].includes(key)) {
      return ROUTES.INSURANCE_MAID.HELPER_DETAIL;
    }
    if (key === 'policy_plan') {
      return ROUTES.INSURANCE_MAID.PLAN;
    }
    if (['addons'].includes(key)) {
      return ROUTES.INSURANCE_MAID.ADD_ON;
    }
    return undefined;
  };

  const addonsSectionData = (
    maidQuote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => {
    const baseData = {
      title: addon.title,
      value: formatCurrency(addon.feeSelected / 1.09),
    };
    if (addon.optionLabel !== 'YES') {
      return {
        ...baseData,
        coverage_amount: formatCurrencyString(addon.optionLabel),
      };
    }
    return baseData;
  });

  const addonsIncludedData = (
    maidQuote?.data?.review_info_premium?.add_ons_included_in_this_plan || []
  ).map((item: any) => ({
    title: item.add_on_name,
    value: 'Included',
  }));

  const selectedPlanTitle = maidQuote?.data?.selected_plan || 'N/A';
  const plans = maidQuote?.data?.plans || [];
  const matchedPlan = plans.find(
    (plan) => plan.title && plan.title.includes(selectedPlanTitle),
  );
  const addonsTitles = matchedPlan?.benefits || [];

  const sharedDataMap: {
    [key: string]: { title: string; value: any; coverage_amount?: string }[];
  } = {
    helper_details: isSingPassFlow
      ? []
      : [
          {
            title: 'Helper’s Full Name',
            value: maidQuote?.data?.maid_info?.name || 'N/A',
          },
          {
            title: 'FIN',
            value: maidQuote?.data?.maid_info?.fin || 'N/A',
          },
          {
            title: 'Passport Number',
            value: maidQuote?.data?.maid_info?.passport_number || 'N/A',
          },
          {
            title:
              'Has the helper been employed by you for more than 12 months?',
            value:
              maidQuote?.data?.maid_info?.has_helper_worked_12_months || 'N/A',
          },
          {
            title: 'Previous Insurer Name',
            value: maidQuote?.data?.maid_info?.company_name || 'N/A',
          },
          {
            title: 'Other Insurer Name',
            value: maidQuote?.data?.maid_info?.company_name_other || 'N/A',
          },
        ],
    helper_basic_information: [
      {
        title: 'Helper Type',
        value: maidQuote?.data?.insurance_other_info?.maid_type || 'N/A',
      },
      {
        title: 'Nationality',
        value: maidQuote?.data?.maid_info?.nationality || 'N/A',
      },
      {
        title: 'Date of Birth',
        value: maidQuote?.data?.maid_info?.date_of_birth || 'N/A',
      },
    ],
    policy_plan: [
      {
        title: 'Selected Plan',
        value: selectedPlanTitle,
      },
      {
        title: 'Plan Details',
        value: addonsTitles.length > 0 ? addonsTitles.join(', ') : 'N/A',
      },
    ],
    addons:
      addonsSectionData.length === 0 && addonsIncludedData.length === 0
        ? [{ title: 'You have no Add Ons selected', value: '' }]
        : [...addonsSectionData, ...addonsIncludedData],
    policy: [
      {
        title: 'Policy Start Date',
        value: maidQuote?.data?.insurance_other_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: maidQuote?.data?.insurance_other_info?.end_date || 'N/A',
      },
      {
        title: 'Policy Duration',
        value: maidQuote?.data?.insurance_other_info?.plan_period || 'N/A',
      },
    ],
    owner: [
      {
        title: 'Name as per NRIC',
        value: maidQuote?.data?.personal_info?.name ?? 'N/A',
      },
      {
        title: 'Date of Birth',
        value: maidQuote?.data?.personal_info?.date_of_birth ?? 'N/A',
      },
      {
        title: 'NRIC/FIN',
        value: maidQuote?.data?.personal_info?.nric ?? 'N/A',
      },
      {
        title: 'Nationality',
        value: maidQuote?.data?.personal_info?.nationality ?? 'N/A',
      },
      {
        title: 'Address Line 1',
        value: maidQuote?.data?.personal_info?.address?.[0] ?? 'N/A',
      },
      {
        title: 'Address Line 2',
        value: maidQuote?.data?.personal_info?.address?.[1]
          ? maidQuote?.data?.personal_info?.address?.[1]
          : 'N/A',
      },
      {
        title: 'Address Line 3',
        value: maidQuote?.data?.personal_info?.address?.[2]
          ? maidQuote?.data?.personal_info?.address?.[2]
          : 'N/A',
      },
      {
        title: 'Postal Code',
        value: maidQuote?.data?.personal_info?.post_code ?? 'N/A',
      },
    ],
    personal: [
      {
        title: 'Email Address',
        value: maidQuote?.data?.personal_info?.email || 'N/A',
      },
      {
        title: 'Phone Number',
        value: maidQuote?.data?.personal_info?.phone,
      },
    ],
  };

  const sections = [
    {
      key: 'helper_details',
      title: 'Helper’s Details',
    },
    {
      key: 'helper_basic_information',
      title: 'Helper’s Basic Information',
    },
    {
      key: 'policy_plan',
      title: 'Policy Plan',
    },
    {
      key: 'addons',
      title: 'Add-ons',
    },
    {
      key: 'policy',
      title: 'Policy Start & End Date',
    },
    {
      key: 'owner',
      title: 'Employer Details',
    },
    {
      key: 'personal',
      title: 'Contact Info',
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      payment(key);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (dataPayment?.payment_url) {
      router.push(dataPayment.payment_url);
    }
  }, [dataPayment]);

  const onPay = async () => {
    if (isFinalized) {
      const savedUrl = localStorage.getItem(MAID_PAYMENT_URL);
      if (savedUrl) {
        window.location.href = savedUrl;
      }
      return;
    }

    const data: any = {
      key: key,
      selected_plan: maidQuote?.data?.selected_plan,
      selected_addons: maidQuote?.data?.selected_addons,
      personal_info: maidQuote?.data?.personal_info,
      maid_info: maidQuote?.data?.maid_info,
    };

    try {
      const res = await saveProposal({
        data,
        productType: PRODUCT_NAME.MAID,
      });
      if (res?.payment_url) {
        saveToLocalStorage({ [MAID_PAYMENT_URL]: res.payment_url });
      }
      if (!res?.final_premium) return;
      dispatch(updateMaidQuote({ is_finalized: true }));
    } catch (error: any) {
      console.error('Unexpected error:', error);
    }
  };

  const handlePayClick = async (formValues?: FormData) => {
    if (isSingPassFlow) {
      const isValid = await methods.trigger();
      if (!isValid) return;

      if (!isDirty) {
        setShowDeclarationModal(true);
        return;
      }
      const formData = formValues || methods.getValues();

      let companyNameText = formData[MAID_QUOTE.company_name];
      if (companyNameText && hirePurchaseListFormatted.length > 0) {
        const found = hirePurchaseListFormatted.find(
          (item) => item.value === companyNameText,
        );
        if (found) {
          companyNameText = found.text;
        }
      }

      if (
        companyNameText === VALUE_OPTION_COMPANY &&
        formData[MAID_QUOTE.company_name_other]
      ) {
        companyNameText = formData[MAID_QUOTE.company_name_other];
      }

      const newFormData = {
        ...formData,
        [MAID_QUOTE.company_name]: companyNameText,
      };

      saveMaidQuote({
        key: key,
        is_sending_email: false,
        data: {
          current_step: 5,
          maid_info: {
            ...maidQuote?.data?.maid_info,
            ...newFormData,
          },
        },
      }).then((res) => {
        if (res) {
          dispatch(updateMaidQuote(res));
          setShowDeclarationModal(true);
        }
      });
    } else {
      setShowDeclarationModal(true);
    }
  };

  const handleDeclarationConfirm = () => {
    setShowDeclarationModal(false);
    onPay();
  };

  const handleDeclarationCancel = () => {
    setShowDeclarationModal(false);
  };

  const totalAddonFeeSelected =
    maidQuote?.data?.review_info_premium?.data_section_add_ons.reduce(
      (total: number, addon: any) => total + (addon.feeSelected || 0),
      0,
    );

  const totalAddonDriver =
    maidQuote?.data?.review_info_premium?.drivers?.reduce(
      (total: number, driver: any, index: number) => {
        if (index === 0) return total;
        return (
          total +
          (maidQuote?.data?.review_info_premium?.addon_additional_driver
            ?.options?.[0]?.premium_with_gst
            ? maidQuote?.data?.review_info_premium?.addon_additional_driver
                .options[0].premium_with_gst
            : 0)
        );
      },
      0,
    ) || 0;

  const totalAdditionFee = totalAddonFeeSelected + totalAddonDriver;
  const planFreeTotal =
    (maidQuote?.data?.review_info_premium?.total_final_price || 0) -
    (totalAdditionFee || 0);

  const _renderPremiumBreakdownContent = (
    <PremiumBreakdownContent
      productType={ProductType.MAID}
      maidQuote={maidQuote}
      dataSelectedAddOn={
        maidQuote?.data?.review_info_premium?.data_section_add_ons
      }
      drivers={maidQuote?.data?.review_info_premium?.drivers ?? []}
      addonAdditionalDriver={
        maidQuote?.data?.review_info_premium?.addon_additional_driver
      }
      pricePlanMain={maidQuote?.data?.review_info_premium?.price_plan ?? 0}
      couponDiscount={
        maidQuote?.data?.review_info_premium?.coupon_discount ?? 0
      }
      tax={1.09}
      gst={maidQuote?.data?.review_info_premium?.gst ?? 0}
      netPremium={maidQuote?.data?.review_info_premium?.net_premium ?? 0}
      addonsIncluded={
        maidQuote?.data?.review_info_premium?.add_ons_included_in_this_plan
      }
      onClose={() => setIsShowPopupPremium(false)}
    />
  );

  const HelperDetailsForm = () => (
    <FormProvider {...methods}>
      <Form
        form={form}
        className='flex flex-col gap-2'
        onFinish={methods.handleSubmit(handlePayClick)}
        disabled={isPendingSave || isPendingPay || isPendingSaveQuote}
      >
        <div className='flex flex-col gap-4 rounded-b-lg border border-t-0 border-[#F0F0F0] p-4'>
          <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8'>
            <Form.Item
              name='name'
              validateStatus={errors['name'] ? 'error' : ''}
            >
              <InputField
                name='name'
                label='Full Name'
                isRequired
                placeholder='Enter Helper’s Full Name as per FIN'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value.replace(REGEX_TEXT, '');
                  methods.setValue('name', value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              name={MAID_QUOTE.fin}
              validateStatus={errors[MAID_QUOTE.fin] ? 'error' : ''}
            >
              <InputField
                name={MAID_QUOTE.fin}
                label='FIN'
                isRequired
                placeholder='Enter Helper’s FIN Number'
                maxLength={9}
              />
            </Form.Item>

            <Form.Item
              name={MAID_QUOTE.passport_number}
              validateStatus={errors[MAID_QUOTE.passport_number] ? 'error' : ''}
            >
              <InputField
                name={MAID_QUOTE.passport_number}
                label='Passport Number'
                isRequired
                placeholder='Enter Helper’s Passport number'
              />
            </Form.Item>

            <Form.Item
              name={MAID_QUOTE.has_helper_worked_12_months}
              validateStatus={
                errors[MAID_QUOTE.has_helper_worked_12_months] ? 'error' : ''
              }
            >
              <RadioField
                name={MAID_QUOTE.has_helper_worked_12_months}
                label='Has the helper been employed by you for more than 12 months?'
                isRequired
                options={HAS_HELPER_WORKED_OPTION}
              />
            </Form.Item>

            {selectedHasTheHelper === HasHelperValue.YES && (
              <>
                <Form.Item
                  name={MAID_QUOTE.company_name}
                  validateStatus={
                    errors[MAID_QUOTE.company_name] ? 'error' : ''
                  }
                >
                  <LongOptionDropdownField
                    name={MAID_QUOTE.company_name}
                    label='Previous Insurer Name'
                    placeholder='Select Insurer'
                    options={hirePurchaseListFormatted}
                    showSearch
                    isRequired={true}
                  />
                </Form.Item>

                {selectedCompanyName === VALUE_OPTION_COMPANY && (
                  <Form.Item
                    name={MAID_QUOTE.company_name_other}
                    validateStatus={
                      errors[MAID_QUOTE.company_name_other] ? 'error' : ''
                    }
                  >
                    <InputField
                      name={MAID_QUOTE.company_name_other}
                      label='Other Insurer Name'
                      isRequired
                      placeholder='Enter Other Insurer Name'
                    />
                  </Form.Item>
                )}
              </>
            )}
          </div>
        </div>
      </Form>
    </FormProvider>
  );

  return (
    <div className='flex w-full flex-col items-center px-4 py-4 md:py-4'>
      <div
        className={`flex w-full flex-col justify-center md:gap-10 ${isMobile ? 'pb-20 md:flex-row' : 'item-center max-w-[1280px] flex-col p-4 pb-28'}`}
      >
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <div className='pb-4 text-[16px] font-bold underline'>Summary</div>
            {sections.map((section, index) => {
              // Handle special case for policy_plan + addons on desktop
              if (
                !isMobile &&
                section.key === 'policy_plan' &&
                sections[index + 1]?.key === 'addons'
              ) {
                const policyData = sharedDataMap['policy_plan'] || [];
                const addonsData = sharedDataMap['addons'] || [];

                return (
                  <div key='policy_plan' className='flex gap-4'>
                    <ReviewSection
                      productType={ProductType.MAID}
                      key='policy_plan'
                      title='Policy Plan'
                      data={policyData}
                      isExpanded={true}
                      sectionKey='policy_plan'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('policy_plan')}
                      isPendingSave={isPendingSave}
                      isPendingPay={isPendingPay}
                    />
                    <ReviewSection
                      productType={ProductType.MAID}
                      key='addons'
                      title='Add-ons'
                      data={addonsData}
                      isExpanded={true}
                      sectionKey='addons'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('addons')}
                      isPendingSave={isPendingSave}
                      isPendingPay={isPendingPay}
                    />
                  </div>
                );
              }

              // Skip rendering 'addons' if already rendered with 'policy_plan'
              if (
                !isMobile &&
                section.key === 'addons' &&
                sections[index - 1]?.key === 'policy_plan'
              ) {
                return null;
              }

              if (section.key === 'helper_details' && isSingPassFlow) {
                return (
                  <div key='helper_details'>
                    <div className='rounded-t-lg bg-[#F4FBFD] px-4 py-3 font-bold'>
                      {section.title}
                    </div>
                    <HelperDetailsForm />
                  </div>
                );
              }

              return (
                <ReviewSection
                  productType={ProductType.MAID}
                  key={section.key}
                  title={section.title}
                  data={sharedDataMap[section.key] || []}
                  isExpanded={true}
                  sectionKey={section.key}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                  isPendingSave={isPendingSave}
                  isPendingPay={isPendingPay}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className='mt-16 w-full bg-[#FFFEFF] md:mt-2'>
        <PricingSummary
          productType={ProductType.MAID}
          planFee={planFreeTotal}
          addonFee={totalAdditionFee}
          discount={maidQuote?.promo_code?.discount || 0}
          loading={isPendingSave || isPendingPay}
          title='Premium breakdown'
          textButton='Submit & Pay'
          handleBack={handleBack}
          onClick={handlePayClick}
          setIsShowPopupPremium={setIsShowPopupPremium}
        />
        {isMobile ? (
          <Drawer
            placement='bottom'
            open={isShowPopupPremium}
            onClose={() => setIsShowPopupPremium(false)}
            closable={false}
            height='auto'
            className='w-full rounded-t-xl'
          >
            {_renderPremiumBreakdownContent}
          </Drawer>
        ) : (
          <Modal
            open={isShowPopupPremium}
            onCancel={() => setIsShowPopupPremium(false)}
            closable={false}
            maskClosable={true}
            keyboard={true}
            footer={null}
            width={385}
            centered
          >
            <div>{_renderPremiumBreakdownContent}</div>
          </Modal>
        )}
      </div>
      <DeclarationConfirmModal
        visible={showDeclarationModal}
        onOk={handleDeclarationConfirm}
        onCancel={handleDeclarationCancel}
      />
    </div>
  );
}
