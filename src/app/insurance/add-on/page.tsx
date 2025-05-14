'use client';
import InsuranceLayout from '../InsuranceLayout';
import AddOnDetail from './AddonDetail';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}
