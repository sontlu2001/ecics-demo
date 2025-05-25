'use client';

import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { formatPromoCode, generateKeyAndAttachToUrl } from '@/libs/utils/utils';

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
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

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
  const dispatch = useAppDispatch();

  const promo_code = formatPromoCode(searchParams.get('promo_code'));
  const initKey = searchParams.get('key') || '';

  const [key, setKey] = useState(initKey);

  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.CAR);
  const quoteInfo = useAppSelector((state) => state.quote?.quote);
  const { mutateAsync: generateQuote, isPending } = useGenerateQuote();

  const userInfo = quoteInfo?.data?.personal_info;
  const insuranceInfo = quoteInfo?.data?.insurance_additional_info;
  const selectedVehicle = quoteInfo?.data?.vehicle_info_selected;
  const savedPromoCode = quoteInfo?.promo_code;

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
    [MOTOR_QUOTE.other_hire_purchase]:
      quoteInfo?.company_name_other ?? undefined,
  };

  // Options for Dropdown
  const hirePurchaseListFormatted: DropdownOption[] = [
    ...(Array.isArray(hirePurchaseList)
      ? hirePurchaseList.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      : []),
  ];

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    let payload: any;
    const updateLoadVehicle = {
      ...selectedVehicle,
      ...data?.vehicle_info_selected,
    };
    payload = { ...data, vehicle_info_selected: updateLoadVehicle, key: key };

    if (isSingPassFlow && userInfo) {
      // data from Singpass
      const personal_info = {
        name: userInfo?.name,
        gender: userInfo?.gender,
        marital_status: userInfo?.marital_status,
        date_of_birth: userInfo?.date_of_birth,
        nric: userInfo?.nric,
        address: userInfo?.address,
        driving_experience: userInfo?.driving_experience,
        phone: userInfo?.phone,
        email: userInfo?.email,
      };

      payload = {
        ...payload,
        personal_info: personal_info,
        vehicle_info_selected: selectedVehicle,
      };
    }
    generateQuote(payload).then((res) => {
      if (res) {
        dispatch(updateQuote(res));
      }
      router.push(ROUTES.INSURANCE.PLAN);
    });
  };

  return (
    <>
      <div className='mt-4 w-full md:px-0'>
        {/* turn on Day 1.5 */}
        {/* {isSingPassFlow && (
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
        )} */}
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
