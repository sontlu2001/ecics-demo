'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import InsuranceLayout from '../InsuranceLayout';

interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({
  searchParams,
}: PolicyDetailPageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return (
    <InsuranceLayout>
      {({ onSave }) => <CompletePurchaseDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}
