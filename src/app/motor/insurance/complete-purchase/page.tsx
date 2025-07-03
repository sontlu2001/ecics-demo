'use client';

import { useAppSelector } from '@/redux/store';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({
  searchParams,
}: PolicyDetailPageProps) {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </MotorInsuranceLayout>
  );
}
