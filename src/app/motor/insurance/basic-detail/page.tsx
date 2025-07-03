'use client';

import { useAppSelector } from '@/redux/store';

import { PolicyDetail } from './PolicyDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

export default function PolicyDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </MotorInsuranceLayout>
  );
}
