'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  sgCarRegNoValidator,
  validateNRIC,
} from '@/libs/utils/validation-utils';

import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { ROUTES } from '@/constants/routes';
import { useVerifyRestrictedUser } from '@/hook/cms/verify';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote, useAddNamedDriverInfo } from '@/redux/slices/quote.slice';
import { useAppDispatch } from '@/redux/store';

import { RenewalModal } from '../../basic-detail/modal/RenewalModal';
import { UnableQuote } from '../../basic-detail/modal/UnableQuote';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../../basic-detail/options';
import { PricingSummary } from '../../components/FeeBar';

const createSchema = (listNric: any[] | undefined) =>
  z.object({
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
    gender: z
      .string({
        required_error: 'Gender is required',
        invalid_type_error: 'Gender is required',
      })
      .min(1, 'Gender is required'),
    maritalStatus: z
      .string({
        required_error: 'Marital status is required',
        invalid_type_error: 'Marital status is required',
      })
      .min(1, 'Marital status is required'),
    address: z
      .string({
        required_error: 'Address is required',
        invalid_type_error: 'Address is required',
      })
      .nonempty('Address is required')
      .max(60, 'Address must be at most 60 characters'),
    pinCode: z
      .string({
        required_error: 'Postal Code is required',
        invalid_type_error: 'Postal Code is required',
      })
      .nonempty('Postal Code is required')
      .refine((val) => /^\d{6}$/.test(val), {
        message: 'Postal code must be exactly 6 digits',
      }),
    chasisNumber: z
      .string({
        required_error: 'Chassis is required',
        invalid_type_error: 'Chassis is required',
      })
      .nonempty('Chassis is required')
      .max(50, 'Chassis must be at most 50 characters'),
    engineNumber: z
      .string({
        required_error: 'Engine is required',
        invalid_type_error: 'Engine is required',
      })
      .max(50, 'Engine must be at most 50 characters')
      .optional(),
    vehicleNumber: z
      .string({
        required_error: 'Vehicle number is required',
        invalid_type_error: 'Vehicle number is required',
      })
      .min(1, 'Vehicle number is required')
      .refine((val) => sgCarRegNoValidator(val), {
        message:
          'Please enter a valid vehicle registration no. (e.g. SBA123A).',
      }),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface Props {
  personal_info: any;
  vehicle_info_selected?: any;
  onClose?: () => void;
  planFee: number;
  addonFee?: number;
  discount: number;
  setIsShowPopupPremium?: (isShowPopupPremium: boolean) => void;
}

const AddOnBonusDetailManualForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const {
    personal_info,
    vehicle_info_selected,
    onClose,
    planFee,
    addonFee,
    discount,
    setIsShowPopupPremium,
  } = props;

  const { name, nric, gender, marital_status, address, post_code } =
    personal_info;
  const { vehicle_number, engine_number, chasis_number } =
    vehicle_info_selected;

  const addNamedDriverInfo = useAddNamedDriverInfo();
  const listNamedDriverNric = addNamedDriverInfo?.map(
    (item) => item.nric_or_fin,
  );
  const initFormDate: FormData = {
    name: name,
    nric: nric,
    address: Array.isArray(address) ? address.join('') : address,
    pinCode: post_code,
    vehicleNumber: vehicle_number,
    engineNumber: engine_number,
    chasisNumber: chasis_number,
    gender: gender,
    maritalStatus: marital_status,
  };
  const schema = useMemo(
    () => createSchema(listNamedDriverNric),
    [listNamedDriverNric],
  );
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const router = useRouterWithQuery();
  const { isMobile } = useDeviceDetection();
  const [form] = Form.useForm();
  const [showCSModal, setShowCSModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const { mutateAsync: saveQuote, isPending: isPending } = useSaveQuote();
  const { mutateAsync: verifyRestrictedUser } = useVerifyRestrictedUser();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initFormDate,
  });

  const {
    formState: { errors },
  } = methods;

  const handleSubmit = (data: FormData) => {
    const transformedData: any = {
      current_step: 3,
      personal_info: {
        ...personal_info,
        email: personal_info?.email ?? '',
        phone: personal_info?.phone ?? '',
        date_of_birth: personal_info?.date_of_birth ?? '',
        driving_experience: personal_info?.driving_experience ?? 0,
        name: data.name,
        nric: data.nric,
        gender: data.gender,
        marital_status: data.maritalStatus,
        address: [data.address],
        post_code: data.pinCode,
      },
      vehicle_info_selected: {
        ...vehicle_info_selected,
        vehicle_number: data.vehicleNumber,
        engine_number: data.engineNumber,
        chasis_number: data.chasisNumber,
      },
    };

    verifyRestrictedUser({
      vehicle_registration_number: data?.vehicleNumber ?? '',
      national_identity_no: data?.nric,
    })
      .then((res) => {
        if (res?.isAllowNewBiz === false) {
          setShowCSModal(true);
        }
        if (res?.isAllowNewBiz === true && res?.isAllowRenewal === true) {
          setShowRenewalModal(true);
        }
      })
      .catch((err) => {
        const dataQuote = {
          key,
          data: transformedData,
          is_sending_email: false,
        };
        saveQuote(dataQuote).then((res) => {
          if (res) {
            dispatch(updateQuote(res));
          }
          router.push(ROUTES.INSURANCE.COMPLETE_PURCHASE);
        });
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
        }}
        onFinish={methods.handleSubmit(handleSubmit)}
        className='w-full px-4'
        disabled={isPending}
      >
        {/* MyInfo block */}
        {/*<div*/}
        {/*    className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[8px]'}`}>*/}
        {/*    <div className='text-lg font-bold'>Save Time with Myinfo</div>*/}
        {/*    <div className={`mb-[20px] ${!isMobile ? 'flex flex-row items-center justify-between' : ''}`}>*/}
        {/*        <div className={`mb-4 sm:mb-0 ${!isMobile ? '' : 'text-justify'}`}>*/}
        {/*            Use Myinfo and instantly autofill your information securely with Myinfo, saving time and*/}
        {/*            ensuring accuracy.*/}
        {/*        </div>*/}
        {/*        <button type="button"*/}
        {/*                className='flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20'>*/}
        {/*            <p className='text-xl font-semibold'>Retrieve Myinfo with</p>*/}
        {/*            <Image src='/singpass.svg' alt='Logo' width={100} height={100} className='pt-2'/>*/}
        {/*        </button>*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/* Personal Details */}
        <div
          className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[14px]'}`}
        >
          <div className={`text-lg font-bold ${isMobile ? 'mt-[28px]' : ''}`}>
            Enter Personal Details
          </div>
          <div className='grid gap-y-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
            <Form.Item
              name='name'
              validateStatus={errors['name'] ? 'error' : ''}
            >
              <InputField
                name='name'
                label='Name as Per NRIC/FIN'
                placeholder='Enter your Name'
              />
            </Form.Item>

            <Form.Item
              name='nric'
              validateStatus={errors['nric'] ? 'error' : ''}
            >
              <InputField
                name='nric'
                label='NRIC/FIN'
                placeholder='Enter NRIC/FIN'
              />
            </Form.Item>

            <Form.Item
              name='gender'
              validateStatus={errors['gender'] ? 'error' : ''}
            >
              <DropdownField
                name='gender'
                label='Gender'
                placeholder='Select gender'
                options={GENDER_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name='maritalStatus'
              validateStatus={errors['maritalStatus'] ? 'error' : ''}
            >
              <DropdownField
                name='maritalStatus'
                label='Marital Status'
                placeholder='Select marital status'
                options={MARITAL_STATUS_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name='address'
              validateStatus={errors['address'] ? 'error' : ''}
            >
              <InputField
                name='address'
                label='Address'
                placeholder='Enter Address'
              />
            </Form.Item>

            <Form.Item
              name='pinCode'
              validateStatus={errors['pinCode'] ? 'error' : ''}
            >
              <InputField
                name='pinCode'
                label='Postal Code'
                placeholder='Enter Postal Code'
                inputMode='numeric'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  methods.setValue('pinCode', onlyNums, {
                    shouldValidate: true,
                  });
                }}
                value={methods.watch('pinCode')}
              />
            </Form.Item>
          </div>
        </div>

        {/* Vehicle Details */}
        <div
          className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[14px]'}`}
        >
          <div className={`text-lg font-bold ${isMobile ? 'mt-[6px]' : ''}`}>
            Enter Vehicle Details
          </div>
          <div className='grid gap-y-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
            <Form.Item
              name='chasisNumber'
              validateStatus={errors['chasisNumber'] ? 'error' : ''}
            >
              <InputField
                name='chasisNumber'
                label='Chassis Number'
                placeholder='Enter Chassis Number'
              />
            </Form.Item>

            <Form.Item
              name='engineNumber'
              validateStatus={errors['engineNumber'] ? 'error' : ''}
            >
              <InputField
                name='engineNumber'
                label='Engine Number'
                placeholder='Enter Engine Number'
                required={false}
              />
            </Form.Item>

            <Form.Item
              name='vehicleNumber'
              validateStatus={errors['vehicleNumber'] ? 'error' : ''}
            >
              <InputField
                name='vehicleNumber'
                label='Vehicle Number'
                placeholder='Enter Vehicle Number'
              />
            </Form.Item>
          </div>
        </div>
        <div className='mt-20 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-2'>
          <PricingSummary
            planFee={planFee}
            addonFee={addonFee}
            discount={discount}
            title='Premium breakdown'
            textButton='Continue'
            onClick={methods.handleSubmit(handleSubmit)}
            setIsShowPopupPremium={setIsShowPopupPremium}
            loading={isPending}
          />
        </div>
      </Form>
      {showCSModal && (
        <UnableQuote
          onClick={() => setShowCSModal(false)}
          visible={showCSModal}
        />
      )}
      {showRenewalModal && (
        <RenewalModal
          onCancel={() => setShowRenewalModal(false)}
          onRenew={() => setShowRenewalModal(false)}
          visible={showRenewalModal}
        />
      )}
    </FormProvider>
  );
};

export default AddOnBonusDetailManualForm;
