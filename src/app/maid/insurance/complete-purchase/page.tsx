'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';
import { useAppSelector } from '@/redux/store';

interface PolicyDetailPageProps {}

export default function PolicyDetailPage({}: PolicyDetailPageProps) {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </MaidInsuranceLayout>
  );
}
