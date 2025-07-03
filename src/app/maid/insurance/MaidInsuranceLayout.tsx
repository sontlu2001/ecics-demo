import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import InsuranceLayout from '@/components/layouts/InsuranceLayout';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { setIsSingpassFlow } from '@/redux/slices/general.slice';
import { useAppDispatch } from '@/redux/store';

const maidSteps = {
  [StepProcessBar.FIRST]: ROUTES.MAID.REVIEW_INFO_DETAIL,
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE_MAID.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE_MAID.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE_MAID.ADD_ON,
  [StepProcessBar.PERSONAL_DETAIL]: ROUTES.INSURANCE_MAID.HELPER_DETAIL,
  [StepProcessBar.COMPLETE_PURCHASE]: ROUTES.INSURANCE_MAID.COMPLETE_PURCHASE,
};
type OnSaveHandler = (fn: () => any) => void;

type MaidInsuranceLayoutProps = {
  children: (props: { onSave: OnSaveHandler }) => React.ReactNode;
};

export default function MaidInsuranceLayout({
  children,
}: MaidInsuranceLayoutProps) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const manual = searchParams.get('manual') || '';
  const isManual = manual === 'true';

  useEffect(() => {
    dispatch(setIsSingpassFlow(!isManual));
  }, [manual, dispatch]);

  return (
    <InsuranceLayout
      stepToRoute={maidSteps}
      headerTitle='Maid Insurance Quotation'
      redirectToLoginPath={ROUTES.MAID.LOGIN}
      productType={ProductType.MAID}
    >
      {children}
    </InsuranceLayout>
  );
}
