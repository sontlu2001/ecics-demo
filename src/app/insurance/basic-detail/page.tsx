'use client';
import InsuranceLayout from '../InsuranceLayout';
import { PolicyDetail } from './PolicyDetail';

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
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={!isManual} />
      )}
    </InsuranceLayout>
  );
}
