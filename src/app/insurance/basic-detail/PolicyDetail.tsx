'use client';

import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { Vehicle } from '@/libs/types/quote';
import { adjustDateInDate, convertDateFormat } from '@/libs/utils/date-utils';
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

import PolicyDetailForm from './PolicyDetailForm';
import VehicleBar from '../components/VehicleBar';

interface PolicyDetailProps {
  isSingPassFlow: boolean;
}

export const PolicyDetail = ({ isSingPassFlow = false }: PolicyDetailProps) => {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();

  const partner_code = searchParams.get('partner_code') || '';
  const promo_code = searchParams.get('promo_code')?.toUpperCase().trim() || '';
  const key = searchParams.get('key') || '';

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.CAR);
  const { data: quoteInfo } = useGetQuote(key);
  const { mutate: generateQuote, isSuccess, isPending } = useGenerateQuote();

  const userInfo = quoteInfo?.data?.personal_info;
  const vehicles = quoteInfo?.data?.vehicles ?? [];
  const insuranceInfo = quoteInfo?.data?.insurance_additional_info;

  useEffect(() => {
    const vehicleSelected = quoteInfo?.data?.vehicle_info_selected;
    if (vehicleSelected) {
      setSelectedVehicle(vehicleSelected);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!isSuccess) return;
    router.push(ROUTES.INSURANCE.PLAN);
  }, [isSuccess]);

  const now = new Date();
  const startData = insuranceInfo?.start_date
    ? new Date(insuranceInfo?.start_date)
    : now;
  const endDate = insuranceInfo?.end_date
    ? new Date(insuranceInfo?.end_date)
    : adjustDateInDate(now, 1, 0, -1);
  const dateOfBirth = userInfo?.date_of_birth
    ? new Date(userInfo?.date_of_birth)
    : dayjs().startOf('day').subtract(25, 'years');

  const initialValues = {
    [MOTOR_QUOTE.promo_code]: promo_code ?? '',
    [MOTOR_QUOTE.start_date]: startData,
    [MOTOR_QUOTE.end_date]: endDate,
    [MOTOR_QUOTE.owner_ncd]: insuranceInfo?.no_claim_discount ?? 0,
    [MOTOR_QUOTE.owner_no_of_claims]: insuranceInfo?.no_of_claim ?? 0,

    [MOTOR_QUOTE.email]: userInfo?.email ?? '',
    [MOTOR_QUOTE.mobile]: userInfo?.phone ?? '',
    [MOTOR_QUOTE.owner_dob]: dateOfBirth,
    [MOTOR_QUOTE.owner_drv_exp]: userInfo?.driving_experience ?? undefined,

    [MOTOR_QUOTE.vehicle_make]: selectedVehicle?.vehicle_make ?? '',
    [MOTOR_QUOTE.vehicle_model]: selectedVehicle?.vehicle_model ?? '',
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

  // retrieve Hire purchase List
  const verifyPartnerCode = async () => {
    try {
      const resp = await fetch(`/api/v1/partner/info/${partner_code}`);
      if (resp.ok) {
        const response = await resp.json();
        const apiData: { partner_code: number; partner_name: string } =
          response.data;
      }
    } catch (error) {
      console.error('Failed to fetch hire purchase list:', error);
    }
  };

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
        driving_experience: 4,
        phone: userInfo?.phone,
        email: userInfo?.email,
      };

      const vehicle_info_selected = {
        vehicle_make: selectedVehicle?.vehicle_make,
        vehicle_model: selectedVehicle?.vehicle_model,
        first_registered_year: selectedVehicle?.first_registered_year,
        chasis_number: selectedVehicle?.chasis_number,
      };
      payload = { ...payload, personal_info, vehicle_info_selected };
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
          <div className='my-6 grid gap-4 lg:grid-cols-3'>
            <div className='mx-auto w-full sm:max-w-[50%] lg:col-span-1 lg:col-start-2 lg:max-w-none'>
              <VehicleBar
                selected_vehicle={selectedVehicle}
                vehicles={vehicles}
                setSelectedVehicle={setSelectedVehicle}
              />
            </div>
          </div>
        )}
        <PolicyDetailForm
          onSubmit={onSubmit}
          hirePurchaseOptions={hirePurchaseListFormatted}
          isSingpassFlow={isSingPassFlow}
          isLoading={isPending}
          initialValues={initialValues}
        />
      </div>
    </>
  );
};
