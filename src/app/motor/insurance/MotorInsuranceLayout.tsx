'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import InsuranceLayout from '@/components/layouts/InsuranceLayout';

import { ROUTES } from '@/constants/routes';
import { setIsSingpassFlow } from '@/redux/slices/general.slice';
import { useAppDispatch } from '@/redux/store';

import { ProductType } from './basic-detail/options';

const motorSteps = {
  [StepProcessBar.FIRST]: ROUTES.MOTOR.REVIEW_INFO_DETAIL,
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE.ADD_ON,
  [StepProcessBar.PERSONAL_DETAIL]: ROUTES.INSURANCE.PERSONAL_DETAIL,
  [StepProcessBar.COMPLETE_PURCHASE]: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};

type OnSaveHandler = (fn: () => any) => void;

type MotorInsuranceLayoutProps = {
  children: (props: { onSave: OnSaveHandler }) => React.ReactNode;
};

export default function MotorInsuranceLayout({
  children,
}: MotorInsuranceLayoutProps) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const manual = searchParams.get('manual') || '';
  const isManual = manual === 'true';

  useEffect(() => {
    dispatch(setIsSingpassFlow(!isManual));
  }, [manual, dispatch]);

  return (
    <InsuranceLayout
      stepToRoute={motorSteps}
      headerTitle='Car Insurance Quotation'
      redirectToLoginPath={ROUTES.MOTOR.LOGIN}
      productType={ProductType.CAR}
    >
      {children}
    </InsuranceLayout>
  );
}
