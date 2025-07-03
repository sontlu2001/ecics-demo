'use client';

import { useAppSelector } from '@/redux/store';

import { PolicyDetail } from './PolicyDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

export default function PolicyDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </MaidInsuranceLayout>
  );
}
