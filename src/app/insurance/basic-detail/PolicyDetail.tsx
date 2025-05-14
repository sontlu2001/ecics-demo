'use client';

import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { convertDateFormat } from '@/libs/utils/date-utils';
import { generateKeyAndAttachToUrl } from '@/libs/utils/utils';

import { DropdownOption } from '@/components/ui/form/dropdownfield';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { MOTOR_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import {
  useGenerateQuote,
  useGetHirePurchaseList,
  useGetQuote,
} from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

import HeaderVehicleInfo from '../plan/components/HeaderVehicleInfo';
import HeaderVehicleInfoMobile from '../plan/components/HeaderVehicleInfoMobile';
import PolicyDetailForm from './PolicyDetailForm';

interface PolicyDetailProps {
  onSaveRegister: (fn: () => any) => void;
  isSingPassFlow: boolean;
}

export const PolicyDetail = ({
  isSingPassFlow = false,
  onSaveRegister,
}: PolicyDetailProps) => {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();

  const promo_code = searchParams.get('promo_code')?.toUpperCase().trim() || '';
  const key = searchParams.get('key') || '';

  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.CAR);
  const { data: quoteInfo } = useGetQuote(key);
  const { mutate: generateQuote, isSuccess, isPending } = useGenerateQuote();

  const userInfo = quoteInfo?.data?.personal_info;
  const insuranceInfo = quoteInfo?.data?.insurance_additional_info;
  const selectedVehicle = quoteInfo?.data?.vehicle_info_selected;
  const savedPromoCode = quoteInfo?.promo_code;

  useEffect(() => {
    if (!isSuccess) return;
    router.push(ROUTES.INSURANCE.PLAN);
  }, [isSuccess]);

  const dateOfBirth = userInfo?.date_of_birth
    ? dayjs(userInfo?.date_of_birth, 'DD/MM/YYYY').toDate()
    : undefined;
  const startData = insuranceInfo?.start_date
    ? dayjs(insuranceInfo?.start_date, 'DD/MM/YYYY').toDate()
    : undefined;
  const endDate = insuranceInfo?.end_date
    ? dayjs(insuranceInfo?.end_date, 'DD/MM/YYYY').toDate()
    : undefined;

  const initialValues = {
    [MOTOR_QUOTE.promo_code]: savedPromoCode?.code ?? promo_code ?? '',
    [MOTOR_QUOTE.start_date]: startData,
    [MOTOR_QUOTE.end_date]: endDate,
    [MOTOR_QUOTE.owner_ncd]: insuranceInfo?.no_claim_discount ?? undefined,
    [MOTOR_QUOTE.owner_no_of_claims]: insuranceInfo?.no_of_claim ?? undefined,

    [MOTOR_QUOTE.email]: userInfo?.email ?? '',
    [MOTOR_QUOTE.mobile]: userInfo?.phone ?? '',
    [MOTOR_QUOTE.owner_dob]: dateOfBirth,
    [MOTOR_QUOTE.owner_drv_exp]: userInfo?.driving_experience ?? undefined,

    [MOTOR_QUOTE.vehicle_make]: selectedVehicle?.vehicle_make ?? undefined,
    [MOTOR_QUOTE.vehicle_model]: selectedVehicle?.vehicle_model ?? undefined,
    [MOTOR_QUOTE.reg_yyyy]: selectedVehicle?.first_registered_year ?? undefined,
    [MOTOR_QUOTE.hire_purchase]: quoteInfo?.company_id ?? undefined,
  };

  // Options for Dropdown
  const hirePurchaseListFormatted: DropdownOption[] = [
    { value: 0, text: '-- Others (Not Available in this list) --' },
    ...(Array.isArray(hirePurchaseList)
      ? hirePurchaseList.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      : []),
  ];

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    let payload;

    const keyQuote = generateKeyAndAttachToUrl(key);
    payload = { ...data, key: keyQuote };
    if (isSingPassFlow && userInfo) {
      // data from Singpass
      const personal_info = {
        name: userInfo?.name,
        gender: userInfo?.gender,
        maritalStatus: userInfo?.marital_status,
        date_of_birth: convertDateFormat(userInfo?.date_of_birth, 'DD/MM/YYYY'),
        nric: userInfo?.nric,
        address: userInfo?.address,
        driving_experience: userInfo?.driving_experience,
        phone: userInfo?.phone,
        email: userInfo?.email,
      };
      const personalInfo = {
        date_of_birth: personal_info.date_of_birth,
        driving_experience: personal_info.driving_experience,
        email: personal_info.email,
        phone: personal_info.phone,
      };
      const vehicle_info_selected = {
        chasis_number: selectedVehicle?.chasis_number,
        first_year_registered: selectedVehicle?.first_registered_year,
        vehicle_make: selectedVehicle?.vehicle_make,
        vehicle_model: selectedVehicle?.vehicle_model,
      };

      payload = {
        ...payload,
        personal_info: personalInfo,
        vehicle_info_selected: vehicle_info_selected,
      };
    }

    try {
      generateQuote(payload);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <div className='mt-4 px-4 md:px-12'>
        {isSingPassFlow && (
          <>
            <div className='mb-8 hidden items-center justify-between md:flex md:flex-col md:gap-4'>
              <HeaderVehicleInfo
                vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                insuranceAdditionalInfo={
                  quoteInfo?.data.insurance_additional_info
                }
              />
            </div>
            <div className='py-4 md:hidden'>
              <HeaderVehicleInfoMobile
                vehicleInfo={quoteInfo?.data.vehicle_info_selected}
              />
            </div>
          </>
        )}
        <PolicyDetailForm
          onSubmit={onSubmit}
          hirePurchaseOptions={hirePurchaseListFormatted}
          isSingpassFlow={isSingPassFlow}
          isLoading={isPending}
          initialValues={initialValues}
          onSaveRegister={onSaveRegister}
        />
      </div>
    </>
  );
};
