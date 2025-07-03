'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { finValidator, validateNRIC } from '@/libs/utils/validation-utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';
import ModalPremium from '@/components/page/insurance/add-on/ModalPremium';
import { DatePickerField } from '@/components/ui/form/datepicker';
import {
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { RadioField } from '@/components/ui/form/radiofield';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { REGEX_TEXT } from '@/app/api/utils/regex';
import {
  HAS_HELPER_WORKED_OPTION,
  HasHelperValue,
  ProductType,
} from '@/app/motor/insurance/basic-detail/options';
import { MAID_QUOTE } from '@/constants';
import {
  GROUP_COUNTRY,
  VALUE_OPTION_COMPANY,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { passportRegex } from '@/constants/validation.constant';
import { useGetNationality } from '@/hook/insurance/common';
import { useSaveMaidQuote } from '@/hook/insurance/maidQuote';
import { useGetHirePurchaseList } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAddNamedDriverInfo } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

const createSchema = (listNric: any[] | undefined) =>
  z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name is required',
        })
        .min(3, 'Name must be at least 3 characters')
        .max(60, 'Name must be at most 60 characters')
        .nonempty('Name is required'),
      nric: z
        .string({
          required_error: 'NRIC/FIN is required',
          invalid_type_error: 'NRIC/FIN is required',
        })
        .nonempty('NRIC/FIN is required')
        .refine((val) => validateNRIC([val]), {
          message: 'Please enter a valid NRIC/FIN.',
        })
        .refine(
          (val) => {
            const isUniqueNric =
              !listNric ||
              !listNric
                .map((item) => item?.toUpperCase())
                .includes(val?.toUpperCase());
            return isUniqueNric;
          },
          {
            message: 'NRIC/FIN already used by an additional driver.',
          },
        ),
      address1: z
        .string({
          required_error: 'Address is required',
          invalid_type_error: 'Address is required',
        })
        .nonempty('Address is required')
        .max(60, 'Address must be at most 60 characters'),
      address2: z
        .string()
        .max(60, 'Address must be at most 60 characters')
        .optional(),
      address3: z
        .string()
        .max(60, 'Address must be at most 60 characters')
        .optional(),
      pinCode: z
        .string({
          required_error: 'Postal Code is required',
          invalid_type_error: 'Postal Code is required',
        })
        .nonempty('Postal Code is required')
        .refine((val) => /^\d{6}$/.test(val), {
          message: 'Postal code must be exactly 6 digits',
        })
        .refine(
          (val) => {
            const num = Number(val);
            return num > 10000 && num < 999999;
          },
          {
            message: 'Postal code must be between 10001 and 999998',
          },
        ),
      nameHelper: z
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
      [MAID_QUOTE.maid_dob]: z.date({
        required_error: 'Date of birth is required',
      }),
      [MAID_QUOTE.nationality]: z
        .string({
          required_error: 'Nationality is required',
        })
        .nonempty('Nationality is required'),
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
      const nric = data.nric;
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
          message: 'FIN and NRIC/FIN must not be the same.',
        });
        ctx.addIssue({
          path: ['nric'],
          code: z.ZodIssueCode.custom,
          message: 'NRIC/FIN and FIN must not be the same.',
        });
      }
    });

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface Props {
  onSaveRegister: (fn: () => any) => void;
}

const HelpersDetail = (props: Props) => {
  const { onSaveRegister } = props;
  const dispatch = useAppDispatch();
  const { handleBack } = useInsurance();

  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const maidQuoteInfo = useAppSelector((state) => state.maidQuote.maidQuote);
  const maidInfo = maidQuoteInfo?.data?.maid_info;
  const personal_info = maidQuoteInfo?.data?.personal_info;
  const maid_info = maidQuoteInfo?.data?.maid_info;
  const { name, date_of_birth, nric, address, post_code, nationality } =
    personal_info ?? {};
  const {
    fin,
    passport_number,
    has_helper_worked_12_months,
    company_name,
    company_name_other,
  } = maid_info ?? {};

  const startDate = maidQuoteInfo?.data?.insurance_other_info?.start_date
    ? dayjs(maidQuoteInfo.data.insurance_other_info.start_date, 'DD/MM/YYYY')
    : null;

  const minDate = startDate?.subtract(120, 'year').add(1, 'day');
  const maxDate = startDate?.subtract(21, 'year');

  const addNamedDriverInfo = useAddNamedDriverInfo();
  const listNamedDriverNric = addNamedDriverInfo?.map(
    (item) => item.nric_or_fin,
  );

  const schema = useMemo(
    () => createSchema(listNamedDriverNric),
    [listNamedDriverNric],
  );

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const router = useRouterWithQuery();
  const { isMobile } = useDeviceDetection();
  const [form] = Form.useForm();

  const { mutateAsync: saveMaidQuote, isPending: isPending } =
    useSaveMaidQuote();
  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.MAID);
  const { data: nationalOptions } = useGetNationality(
    GROUP_COUNTRY.country_for_employer,
  );

  const nationalOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!nationalOptions) return [];
    return nationalOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [nationalOptions]);

  const hirePurchaseListFormatted: DropdownOption[] = [
    ...(Array.isArray(hirePurchaseList)
      ? hirePurchaseList.map((item: any) => ({
          value: String(item.id),
          text: item.name,
        }))
      : []),
  ];

  const companyOption = hirePurchaseListFormatted.find(
    (item) => item.text === company_name,
  );

  const companyId = companyOption ? String(companyOption.value) : '';

  const initFormDate: FormData = {
    name: name ?? '',
    nric: nric ?? '',
    address1: address?.[0] ?? '',
    address2: address?.[1] ?? '',
    address3: address?.[2] ?? '',
    pinCode: post_code ?? '',
    [MAID_QUOTE.nationality]: nationality ?? '',
    [MAID_QUOTE.maid_dob]: date_of_birth
      ? dayjs(date_of_birth, 'DD/MM/YYYY').toDate()
      : undefined,
    nameHelper: maid_info?.name ?? '',
    [MAID_QUOTE.fin]: fin ?? '',
    [MAID_QUOTE.passport_number]: passport_number ?? '',
    [MAID_QUOTE.has_helper_worked_12_months]: has_helper_worked_12_months ?? '',
    [MAID_QUOTE.company_name]: companyId,
    [MAID_QUOTE.company_name_other]: company_name_other ?? '',
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initFormDate,
  });

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

  const planFreeTotal =
    (maidQuoteInfo?.data?.review_info_premium?.total_final_price || 0) -
    (maidQuoteInfo?.data?.review_info_premium?.total_addon_free || 0);

  const {
    formState: { errors },
  } = methods;

  const handleSubmit = (data: FormData) => {
    const selectedInsurer = hirePurchaseListFormatted.find(
      (item) => item.value === data.company_name,
    );
    const companyNameText = selectedInsurer ? selectedInsurer.text : '';

    const maidCompanyNameOther =
      data.company_name === VALUE_OPTION_COMPANY
        ? (data.company_name_other ?? '')
        : '';

    const transformedData: any = {
      current_step: 4,
      personal_info: {
        ...personal_info,
        email: personal_info?.email?.toLowerCase() ?? '',
        phone: personal_info?.phone ?? '',
        name: data.name,
        nric: (data.nric as string)?.toUpperCase() ?? '',
        address: [data.address1, data.address2, data.address3],
        nationality: data.nationality,
        post_code: data.pinCode,
        date_of_birth: dayjs(data.date_of_birth).format('DD/MM/YYYY'),
      },
      maid_info: {
        ...maidInfo,
        name: data.nameHelper,
        fin: (data.fin as string)?.toUpperCase() ?? '',
        passport_number: (data.passport_number as string)?.toUpperCase() ?? '',
        company_name: companyNameText,
        company_name_other: maidCompanyNameOther,
        has_helper_worked_12_months: data.has_helper_worked_12_months,
      },
    };

    const dataQuote = {
      key,
      data: transformedData,
      is_sending_email: false,
    };
    saveMaidQuote(dataQuote).then((res) => {
      if (res) {
        dispatch(updateMaidQuote(res));
      }
      router.push(ROUTES.INSURANCE_MAID.COMPLETE_PURCHASE);
    });
  };

  return (
    <FormProvider {...methods}>
      <div className='flex w-full justify-center'>
        <Form
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
          onFinish={methods.handleSubmit(handleSubmit)}
          className='w-full px-4 md:max-w-[1280px]'
          disabled={isPending}
        >
          <div className='flex flex-col gap-4'>
            <p className='text-base font-bold leading-[35px] underline '>
              Helper’s Details
            </p>
            <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8'>
              <Form.Item
                name='nameHelper'
                validateStatus={errors['nameHelper'] ? 'error' : ''}
              >
                <InputField
                  name='nameHelper'
                  label='Full Name'
                  isRequired
                  placeholder='Enter Helper’s Full Name as per FIN'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(REGEX_TEXT, '');
                    methods.setValue('nameHelper', value, {
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
                validateStatus={
                  errors[MAID_QUOTE.passport_number] ? 'error' : ''
                }
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
                      disabled={isPending}
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

          <div
            className={`flex w-full flex-col gap-4 ${isMobile ? '' : 'mt-6'}`}
          >
            <div
              className={`text-base font-bold underline ${isMobile ? 'mt-[28px]' : ''}`}
            >
              Enter Personal Details
            </div>
            <div className='sm:grid-col-2 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8'>
              <Form.Item
                name='name'
                validateStatus={errors['name'] ? 'error' : ''}
              >
                <InputField
                  name='name'
                  label='Full Name as per NRIC / FIN'
                  isRequired
                  placeholder='Enter Your Full Name as per NRIC/FIN'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(REGEX_TEXT, '');
                    methods.setValue('name', value, { shouldValidate: true });
                  }}
                />
              </Form.Item>

              <Form.Item
                name={MAID_QUOTE.maid_dob}
                validateStatus={errors[MAID_QUOTE.maid_dob] ? 'error' : ''}
              >
                <DatePickerField
                  name={MAID_QUOTE.maid_dob}
                  label='Date of birth'
                  minDate={minDate}
                  maxDate={maxDate}
                  isRequired={true}
                  placeholder='Select your Date of Birth'
                />
              </Form.Item>

              <Form.Item
                name='nric'
                validateStatus={errors['nric'] ? 'error' : ''}
              >
                <InputField
                  name='nric'
                  label='NRIC/FIN'
                  isRequired
                  placeholder='Enter Your NRIC / FIN Number'
                />
              </Form.Item>

              <Form.Item
                name={MAID_QUOTE.nationality}
                validateStatus={errors[MAID_QUOTE.nationality] ? 'error' : ''}
              >
                <LongOptionDropdownField
                  name={MAID_QUOTE.nationality}
                  label='Nationality'
                  placeholder={`Select Employer's Nationality`}
                  options={nationalOptionsFormatted}
                  disabled={isPending}
                  onChange={() => {
                    // Reset model when make changes
                    methods.setValue(MAID_QUOTE.nationality, null as any);
                  }}
                  showSearch
                  isRequired={true}
                />
              </Form.Item>

              <Form.Item
                name='address1'
                validateStatus={errors['address1'] ? 'error' : ''}
              >
                <InputField
                  name='address1'
                  isRequired
                  label='Address Line 1'
                  placeholder='Block number and street name'
                />
              </Form.Item>

              <Form.Item
                name='address2'
                validateStatus={errors['address2'] ? 'error' : ''}
              >
                <InputField
                  name='address2'
                  label='Address Line 2'
                  placeholder='Unit number (floor-unit format)'
                />
              </Form.Item>

              <Form.Item
                name='address3'
                validateStatus={errors['address3'] ? 'error' : ''}
              >
                <InputField
                  name='address3'
                  label='Address Line 3'
                  placeholder='Building Name or estate name (Optional)'
                />
              </Form.Item>

              <Form.Item
                name='pinCode'
                validateStatus={errors['pinCode'] ? 'error' : ''}
              >
                <InputField
                  name='pinCode'
                  label='Postal Code'
                  isRequired
                  placeholder='6-digit Postal Code'
                  inputMode='numeric'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    methods.setValue('pinCode', onlyNums, {
                      shouldValidate: true,
                    });
                  }}
                  value={methods.watch('pinCode') as string}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
        <ModalPremium
          productType={ProductType.MAID}
          isShowPopupPremium={isShowPopupPremium}
          setIsShowPopupPremium={setIsShowPopupPremium}
          maidQuote={maidQuoteInfo}
          dataSelectedAddOn={
            maidQuoteInfo?.data?.review_info_premium?.data_section_add_ons
          }
          drivers={maidQuoteInfo?.data?.review_info_premium?.drivers ?? []}
          addonAdditionalDriver={
            maidQuoteInfo?.data?.review_info_premium?.addon_additional_driver
          }
          pricePlanMain={
            maidQuoteInfo?.data?.review_info_premium?.price_plan ?? 0
          }
          couponDiscount={
            maidQuoteInfo?.data?.review_info_premium?.coupon_discount ?? 0
          }
          tax={1.09}
          gst={maidQuoteInfo?.data?.review_info_premium?.gst ?? 0}
          netPremium={
            maidQuoteInfo?.data?.review_info_premium?.net_premium ?? 0
          }
          addonsIncluded={
            maidQuoteInfo?.data?.review_info_premium
              ?.add_ons_included_in_this_plan
          }
        />
      </div>
      <div className='mt-20 w-full bg-[#FFFEFF] md:mt-10'>
        <PricingSummary
          productType={ProductType.MAID}
          planFee={planFreeTotal}
          addonFee={maidQuoteInfo?.data?.review_info_premium?.total_addon_free}
          discount={maidQuoteInfo?.promo_code?.discount || 0}
          title='Premium breakdown'
          textButton='Next'
          handleBack={handleBack}
          onClick={methods.handleSubmit(handleSubmit)}
          setIsShowPopupPremium={setIsShowPopupPremium}
          loading={isPending}
        />
      </div>
    </FormProvider>
  );
};

export default HelpersDetail;
