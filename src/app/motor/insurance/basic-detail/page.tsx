'use client';

import { useSearchParams } from 'next/navigation';

import { PolicyDetail } from './PolicyDetail';
import InsuranceLayout from '../InsuranceLayout';

export default function PolicyDetailPage() {
  const params = useSearchParams();
  const manual = params?.get('manual') || '';
  const isManual = manual === 'true' ? true : false;

  return (
    <InsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={!isManual} />
      )}
    </InsuranceLayout>
  );
}
